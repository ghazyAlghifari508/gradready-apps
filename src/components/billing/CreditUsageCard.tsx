"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Plan } from "@/generated/prisma/client";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";

export default function CreditUsageCard({
  plan,
  used,
  limit,
  periodEnd,
}: {
  plan: Plan;
  used: number;
  limit: number;
  periodEnd: Date | string;
}) {
  const remaining = Math.max(0, limit - used);
  const pct = limit > 0 ? Math.round((remaining / limit) * 100) : 0;
  const variant = pct > 50 ? "default" : pct >= 20 ? "in-progress" : "low";
  const showUpgrade = plan === "FREE" || remaining <= 1;

  return (
    <Card className="h-full">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "var(--dark-blue)",
              margin: 0,
            }}
          >
            Kredit AI
          </h3>
          <Badge variant={plan === "PLUS" ? "premium" : "in-progress"}>
            {plan}
          </Badge>
        </div>

        <div>
          <div
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 42,
              lineHeight: 1,
              color: "var(--dark-blue)",
            }}
          >
            {remaining}
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "var(--gray-light)",
              }}
            >
              /{limit}
            </span>
          </div>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--gray-light)",
            }}
          >
            Reset {format(new Date(periodEnd), "dd MMMM yyyy", { locale: idLocale })}
          </p>
        </div>

        <ProgressBar value={pct} variant={variant} />

        {showUpgrade && (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => {
              window.location.href = "/pricing";
            }}
          >
            Upgrade Plan
          </Button>
        )}
      </div>
    </Card>
  );
}
