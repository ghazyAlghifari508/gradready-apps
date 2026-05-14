import "server-only";

import type { Plan, Subscription } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { QuotaExceededError } from "@/lib/errors";
import { PERIOD_DAYS, PLAN_LIMITS } from "@/lib/plans";

export type AiFeature =
  | "CV_ANALYZE"
  | "DOC_GENERATE"
  | "JOBFIT"
  | "SKILLGAP"
  | "MOCK_INTERVIEW";

export type ActiveBillingSubscription = Omit<
  Pick<
  Subscription,
  "id" | "plan" | "status" | "periodStart" | "periodEnd" | "creditsLimit"
  >,
  "id"
> & {
  id: string | null;
  isVirtualFree?: boolean;
};

export function addPeriodDays(date: Date) {
  const next = new Date(date);
  next.setDate(next.getDate() + PERIOD_DAYS);
  return next;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function freePeriodForUserCreatedAt(createdAt: Date) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const userStart = startOfDay(createdAt);

  return {
    periodStart: userStart > monthStart ? userStart : monthStart,
    periodEnd: nextMonthStart,
  };
}

export async function getActiveSubscription(
  userId: string,
): Promise<ActiveBillingSubscription> {
  const now = new Date();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "CANCELED"] },
      periodEnd: { gt: now },
    },
    orderBy: { periodEnd: "desc" },
    select: {
      id: true,
      plan: true,
      status: true,
      periodStart: true,
      periodEnd: true,
      creditsLimit: true,
    },
  });

  if (subscription) {
    return subscription;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });
  const { periodStart, periodEnd } = freePeriodForUserCreatedAt(
    user?.createdAt ?? now,
  );

  return {
    id: null,
    plan: "FREE",
    status: "ACTIVE",
    periodStart,
    periodEnd,
    creditsLimit: PLAN_LIMITS.FREE.credits,
    isVirtualFree: true,
  };
}

export async function getUsageInPeriod(
  userId: string,
  subscription: ActiveBillingSubscription,
) {
  const usage = await prisma.aiUsageLog.aggregate({
    _sum: { creditsUsed: true },
    where: {
      userId,
      createdAt: {
        gte: subscription.periodStart,
        lt: subscription.periodEnd,
      },
    },
  });

  return usage._sum.creditsUsed ?? 0;
}

export async function getRemainingCredits(userId: string) {
  const subscription = await getActiveSubscription(userId);
  const used = await getUsageInPeriod(userId, subscription);
  const limit = subscription.creditsLimit;

  return {
    plan: subscription.plan,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    periodEnd: subscription.periodEnd,
    activeSubscription: subscription,
  };
}

export async function assertAiQuota(userId: string, _feature: AiFeature) {
  const quota = await getRemainingCredits(userId);

  if (quota.remaining <= 0) {
    throw new QuotaExceededError({
      plan: quota.plan as Plan,
      used: quota.used,
      limit: quota.limit,
      upgradeUrl: "/pricing",
    });
  }

  return quota.activeSubscription;
}

export async function consumeCredit(
  userId: string,
  feature: AiFeature,
  subscription?: ActiveBillingSubscription,
) {
  const activeSubscription = subscription ?? (await getActiveSubscription(userId));

  return prisma.aiUsageLog.create({
    data: {
      userId,
      feature,
      creditsUsed: 1,
      subscriptionId: activeSubscription.id,
    },
  });
}
