import type { Plan } from "@/generated/prisma/client";

export const PERIOD_DAYS = 30;

// ponytail: separate feature limits (not a shared pool) as requested
export const FREE_FEATURE_LIMITS = {
  CV_GENERATE: 3,  // cv-builder download
  CV_REVISE: 5,    // AI-revise cv
  DOC_GENERATE: 0, // blocked on FREE
  DOC_REVISE: 0,   // blocked on FREE
} as const;

export type FreeLimitedFeature = keyof typeof FREE_FEATURE_LIMITS;

export const PLAN_LIMITS: Record<
  Plan,
  { priceIDR: number; label: string; features: string[] }
> = {
  FREE: {
    priceIDR: 0,
    label: "Free",
    features: [
      "3x generate CV/bulan",
      "5x revisi CV/bulan",
      "CV Analyzer (upload & skor)",
    ],
  },
  PRO: {
    priceIDR: 49_000,
    label: "Pro",
    features: [
      "Unlimited generate & revisi CV",
      "Semua fitur AI Doc Builder",
      "Motivation Letter, Cover Letter, LinkedIn & lebih",
    ],
  },
  PLUS: {
    priceIDR: 149_000, // ponytail: kept in DB enum; hidden from UI
    label: "Plus",
    features: [],
  },
};

export const PRO_PRICING = {
  monthly: { priceIDR: 49_000, label: "Bulanan", period: 30 },
  yearly:  { priceIDR: 490_000, label: "Tahunan (hemat 2 bln)", period: 365 },
} as const;

export type BillingInterval = keyof typeof PRO_PRICING;
