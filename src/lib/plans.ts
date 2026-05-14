import type { Plan } from "@/generated/prisma/client";

export const PERIOD_DAYS = 30;

export const PLAN_LIMITS: Record<
  Plan,
  { credits: number; priceIDR: number; label: string; features: string[] }
> = {
  FREE: {
    credits: 3,
    priceIDR: 0,
    label: "Free",
    features: [
      "3 kredit AI per bulan",
      "CV Analyzer dasar",
      "AI Doc Builder trial",
    ],
  },
  PRO: {
    credits: 50,
    priceIDR: 49_000,
    label: "Pro",
    features: [
      "50 kredit AI per bulan",
      "Semua fitur AI karir",
      "Cocok untuk pencarian kerja aktif",
    ],
  },
  PLUS: {
    credits: 200,
    priceIDR: 149_000,
    label: "Plus",
    features: [
      "200 kredit AI per bulan",
      "Semua fitur AI karir",
      "Prioritas model fallback",
    ],
  },
};
