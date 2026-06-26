import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  mapNotificationToStatus,
  type MidtransNotification,
  verifyNotificationSignature,
} from "@/lib/midtrans";
import { apiError, handleApiError } from "@/lib/errors";
import { addPeriodDays } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const notification = (await req.json().catch(() => null)) as
      | MidtransNotification
      | null;

    if (!notification?.order_id) {
      return apiError(400, "INVALID_PAYLOAD", "Invalid Midtrans payload");
    }

    if (!verifyNotificationSignature(notification)) {
      return apiError(401, "INVALID_SIGNATURE", "Invalid signature");
    }

    const status = mapNotificationToStatus(notification);
    const rawNotificationJson = JSON.parse(JSON.stringify(notification));

    const subscription = await prisma.subscription.findUnique({
      where: { midtransOrderId: notification.order_id },
    });

    if (!subscription) {
      return apiError(404, "SUBSCRIPTION_NOT_FOUND", "Subscription not found");
    }

    // Fast-path idempotency check (same transaction_id + same status already stored)
    if (
      notification.transaction_id &&
      subscription.midtransTransactionId === notification.transaction_id &&
      subscription.status === status
    ) {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction(
      async (tx) => {
        // Re-check inside transaction to guard concurrent retries
        const fresh = await tx.subscription.findUnique({
          where: { id: subscription.id },
          select: { midtransTransactionId: true, status: true },
        });
        if (
          notification.transaction_id &&
          fresh?.midtransTransactionId === notification.transaction_id &&
          fresh?.status === status
        ) {
          return;
        }

        if (status === "ACTIVE") {
          const now = new Date();
          const periodEnd = addPeriodDays(now);

          await tx.subscription.updateMany({
            where: {
              userId: subscription.userId,
              status: { in: ["ACTIVE", "CANCELED"] },
              id: { not: subscription.id },
            },
            data: { status: "EXPIRED" },
          });

          await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              status,
              periodStart: now,
              periodEnd,
              paymentType: notification.payment_type,
              midtransTransactionId: notification.transaction_id,
              rawNotificationJson,
            },
          });

          await tx.user.update({
            where: { id: subscription.userId },
            data: { plan: subscription.plan },
          });
          return;
        }

        await tx.subscription.update({
          where: { id: subscription.id },
          data: {
            status,
            paymentType: notification.payment_type,
            midtransTransactionId: notification.transaction_id,
            rawNotificationJson,
          },
        });
      },
      { isolationLevel: "Serializable" },
    );

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
