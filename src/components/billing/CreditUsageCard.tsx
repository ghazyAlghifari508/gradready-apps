"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Plan } from "@/generated/prisma/client";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";

type UsageSummary = {
  plan: Plan;
  isPro?: boolean;
  cv?: {
    generate: { used: number; limit: number };
    revise: { used: number; limit: number };
  };
};

export default function CreditUsageCard(data: UsageSummary) {
  const { plan, isPro, cv } = data;

  if (isPro || plan !== "FREE" || !cv) {
    return (
      <Card className="h-full">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark-blue)", margin: 0 }}>
              Kredit AI
            </h3>
            <Badge variant="premium">{plan}</Badge>
          </div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 42, lineHeight: 1, color: "var(--dark-blue)" }}>
            Unlimited
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 700, color: "var(--gray-light)" }}>
            Semua fitur AI terbuka penuh.
          </p>
        </div>
      </Card>
    );
  }

  const cvGenPct = cv.generate.limit > 0 ? Math.round((cv.generate.used / cv.generate.limit) * 100) : 0;
  const cvRevPct = cv.revise.limit > 0 ? Math.round((cv.revise.used / cv.revise.limit) * 100) : 0;

  return (
    <Card className="h-full">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark-blue)", margin: 0 }}>
            Kuota AI (Free)
          </h3>
          <Badge variant="in-progress">{plan}</Badge>
        </div>

        {/* CV Generate */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Generate CV</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--dark-blue)" }}>
              {cv.generate.used}/{cv.generate.limit}
            </span>
          </div>
          <ProgressBar value={100 - cvGenPct} variant={cvGenPct > 80 ? "low" : cvGenPct > 50 ? "in-progress" : "default"} />
        </div>

        {/* CV Revise */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Revisi CV</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--dark-blue)" }}>
              {cv.revise.used}/{cv.revise.limit}
            </span>
          </div>
          <ProgressBar value={100 - cvRevPct} variant={cvRevPct > 80 ? "low" : cvRevPct > 50 ? "in-progress" : "default"} />
        </div>

        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => { window.location.href = "/pricing"; }}
        >
          Upgrade ke Pro
        </Button>
      </div>
    </Card>
  );
}
