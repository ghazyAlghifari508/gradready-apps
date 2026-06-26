import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { PRO_PRICING, type BillingInterval } from "@/lib/plans";
import { createSnapTransaction } from "@/lib/midtrans";
import { apiError, handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  interval: z.enum(["monthly", "yearly"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = checkoutSchema.safeParse(
      await req.json().catch(() => undefined),
    );
    if (!validation.success) {
      return apiError(400, "INVALID_PAYLOAD", validation.error.issues);
    }

    const { interval } = validation.data as { interval: BillingInterval };
    const config = PRO_PRICING[interval];
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + config.period);
    const orderId = `GR-${session.user.id.slice(0, 6)}-${Date.now()}`;

    // Atomic check-then-create: prevents two concurrent requests both passing
    // the "no active subscription" check and creating duplicate PENDING rows.
    const created = await prisma.$transaction(
      async (tx) => {
        const activeSub = await tx.subscription.findFirst({
          where: {
            userId: session.user.id,
            status: { in: ["ACTIVE", "CANCELED"] },
            periodEnd: { gt: now },
          },
          select: { plan: true, periodEnd: true },
        });

        if (activeSub && activeSub.plan !== "FREE") {
          return { conflict: activeSub };
        }

        return tx.subscription.create({
          data: {
            userId: session.user.id,
            plan: "PRO",
            status: "PENDING",
            periodStart: now,
            periodEnd,
            creditsLimit: 0, // ponytail: unused for PRO (unlimited)
            midtransOrderId: orderId,
            grossAmount: config.priceIDR,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if ("conflict" in created) {
      return apiError(
        409,
        "ALREADY_SUBSCRIBED",
        `Langganan ${created.conflict.plan} masih aktif hingga ${created.conflict.periodEnd.toLocaleDateString("id-ID")}. Tunggu sampai masa aktif habis sebelum berlangganan lagi.`,
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.BETTER_AUTH_URL ??
      "http://localhost:3000";
    const finishUrl = `${appUrl}/billing/payment-status?order_id=${encodeURIComponent(orderId)}`;

    const snap = await createSnapTransaction({
      orderId,
      grossAmount: config.priceIDR,
      customer: {
        firstName: session.user.name ?? "GradReady User",
        email: session.user.email,
      },
      itemDetails: [
        {
          id: `gradready-pro-${interval}`,
          price: config.priceIDR,
          quantity: 1,
          name: `GradReady Pro ${config.label}`,
        },
      ],
      callbacks: { finish: finishUrl, pending: finishUrl, error: finishUrl },
    });

    return NextResponse.json({ ...snap, orderId });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
