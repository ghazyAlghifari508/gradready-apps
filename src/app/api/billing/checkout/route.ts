import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, PERIOD_DAYS } from "@/lib/plans";
import { createSnapTransaction } from "@/lib/midtrans";
import { apiError, handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  plan: z.enum(["PRO", "PLUS"]),
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

    const { plan } = validation.data;
    const planConfig = PLAN_LIMITS[plan];
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + PERIOD_DAYS);
    const orderId = `GR-${session.user.id.slice(0, 6)}-${Date.now()}`;

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        plan,
        status: "PENDING",
        periodStart: now,
        periodEnd,
        creditsLimit: planConfig.credits,
        midtransOrderId: orderId,
        grossAmount: planConfig.priceIDR,
      },
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.BETTER_AUTH_URL ??
      "http://localhost:3000";
    const finishUrl = `${appUrl}/billing/payment-status?order_id=${encodeURIComponent(orderId)}`;

    const snap = await createSnapTransaction({
      orderId,
      grossAmount: planConfig.priceIDR,
      customer: {
        firstName: session.user.name ?? "GradReady User",
        email: session.user.email,
      },
      itemDetails: [
        {
          id: `gradready-${plan.toLowerCase()}`,
          price: planConfig.priceIDR,
          quantity: 1,
          name: `GradReady ${planConfig.label} Plan`,
        },
      ],
      callbacks: {
        finish: finishUrl,
        pending: finishUrl,
        error: finishUrl,
      },
    });

    return NextResponse.json({ ...snap, orderId });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
