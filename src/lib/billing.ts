import "server-only";

import type { Plan, Subscription } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { QuotaExceededError } from "@/lib/errors";
import { PERIOD_DAYS, FREE_FEATURE_LIMITS, type FreeLimitedFeature } from "@/lib/plans";

export type AiFeature =
  | "CV_GENERATE"
  | "CV_REVISE"
  | "CV_ANALYZE"
  | "DOC_GENERATE"
  | "DOC_REVISE"
  | "JOBFIT"
  | "SKILLGAP"
  | "MOCK_INTERVIEW";

export type ActiveBillingSubscription = Omit<
  Pick<Subscription, "id" | "plan" | "status" | "periodStart" | "periodEnd" | "creditsLimit">,
  "id"
> & { id: string | null; isVirtualFree?: boolean };

export function addPeriodDays(date: Date, days = PERIOD_DAYS) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
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
    where: { userId, status: { in: ["ACTIVE", "CANCELED"] }, periodEnd: { gt: now } },
    orderBy: { periodEnd: "desc" },
    select: { id: true, plan: true, status: true, periodStart: true, periodEnd: true, creditsLimit: true },
  });

  if (subscription) return subscription;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } });
  const { periodStart, periodEnd } = freePeriodForUserCreatedAt(user?.createdAt ?? now);
  return { id: null, plan: "FREE", status: "ACTIVE", periodStart, periodEnd, creditsLimit: 0, isVirtualFree: true };
}

async function countFeatureUsageThisMonth(userId: string, feature: AiFeature): Promise<number> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const result = await prisma.aiUsageLog.aggregate({
    _sum: { creditsUsed: true },
    where: { userId, feature, createdAt: { gte: monthStart } },
  });
  return result._sum.creditsUsed ?? 0;
}

/** Per-feature usage for FREE users (used by /api/billing/me) */
export async function getFeatureUsageSummary(userId: string) {
  const sub = await getActiveSubscription(userId);
  if (sub.plan !== "FREE") return { plan: sub.plan as Plan, isPro: true };

  const [cvGenerate, cvRevise] = await Promise.all([
    countFeatureUsageThisMonth(userId, "CV_GENERATE"),
    countFeatureUsageThisMonth(userId, "CV_REVISE"),
  ]);

  return {
    plan: "FREE" as Plan,
    isPro: false,
    cv: {
      generate: { used: cvGenerate, limit: FREE_FEATURE_LIMITS.CV_GENERATE },
      revise:   { used: cvRevise,   limit: FREE_FEATURE_LIMITS.CV_REVISE },
    },
  };
}

/** Blocks FREE users — throws QuotaExceededError; PRO passes */
export async function assertProFeature(userId: string) {
  const sub = await getActiveSubscription(userId);
  if (sub.plan === "FREE") {
    throw new QuotaExceededError({ plan: sub.plan, used: 0, limit: 0, upgradeUrl: "/pricing" });
  }
  return sub;
}

/** Checks per-feature monthly limit for FREE; PRO always passes */
export async function assertFeatureQuota(userId: string, feature: FreeLimitedFeature) {
  const sub = await getActiveSubscription(userId);
  if (sub.plan !== "FREE") return sub;

  const limit = FREE_FEATURE_LIMITS[feature];
  if (limit === 0) {
    throw new QuotaExceededError({ plan: sub.plan, used: 0, limit: 0, upgradeUrl: "/pricing" });
  }

  const used = await countFeatureUsageThisMonth(userId, feature as AiFeature);
  if (used >= limit) {
    throw new QuotaExceededError({ plan: sub.plan, used, limit, upgradeUrl: "/pricing" });
  }
  return sub;
}

/** Legacy compat — kept for CV_ANALYZE, JOBFIT, SKILLGAP, MOCK_INTERVIEW (unlimited for all) */
export async function assertAiQuota(userId: string, _feature: AiFeature) {
  return getActiveSubscription(userId);
}

export async function consumeCredit(
  userId: string,
  feature: AiFeature,
  subscription?: ActiveBillingSubscription,
) {
  const activeSub = subscription ?? (await getActiveSubscription(userId));
  return prisma.aiUsageLog.create({
    data: { userId, feature, creditsUsed: 1, subscriptionId: activeSub.id },
  });
}

/** Legacy compat for billing/me and CreditUsageCard */
export async function getRemainingCredits(userId: string) {
  return getFeatureUsageSummary(userId);
}
