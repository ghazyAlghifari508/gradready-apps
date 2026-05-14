import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Plan } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { getRemainingCredits } from "@/lib/billing";
import { PLAN_LIMITS } from "@/lib/plans";
import { Badge, Button, Card } from "@/components/ui";
import PricingCheckoutButton from "./PricingCheckoutButton";

export const metadata = {
  title: "Pricing - GradReady",
};

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PricingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const usage = await getRemainingCredits(session.user.id);
  const activePlan = usage.plan;
  const plans = Object.entries(PLAN_LIMITS) as Array<
    [Plan, (typeof PLAN_LIMITS)[Plan]]
  >;

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 32,
            color: "var(--dark-blue)",
            marginBottom: 8,
          }}
        >
          Pricing
        </h1>
        <p style={{ color: "var(--gray-light)", fontWeight: 700, margin: 0 }}>
          Pilih paket kredit AI bulanan untuk semua fitur karir GradReady.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
        }}
      >
        {plans.map(([plan, config]) => {
          const isActive = activePlan === plan;
          const isPlus = plan === "PLUS";

          return (
            <Card
              key={plan}
              className="h-full"
              style={{
                borderColor: isActive
                  ? "var(--green)"
                  : isPlus
                    ? "#FFC800"
                    : "var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  height: "100%",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "var(--dark-blue)",
                        margin: 0,
                      }}
                    >
                      {config.label}
                    </h2>
                    {(isActive || isPlus) && (
                      <Badge variant={isPlus ? "premium" : "completed"}>
                        {isActive ? "Aktif" : "Populer"}
                      </Badge>
                    )}
                  </div>

                  <div
                    style={{
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: 34,
                      color: "var(--dark-blue)",
                    }}
                  >
                    {config.priceIDR === 0 ? "Rp 0" : formatIDR(config.priceIDR)}
                    <span
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        color: "var(--gray-light)",
                      }}
                    >
                      /bulan
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    backgroundColor: "var(--bg-gray)",
                    fontWeight: 900,
                    color: "var(--green)",
                  }}
                >
                  {config.credits} kredit AI / bulan
                </div>

                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: 0,
                    margin: 0,
                    listStyle: "none",
                    flex: 1,
                  }}
                >
                  {config.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--gray-text)",
                      }}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan === "FREE" ? (
                  <Button className="w-full" variant="secondary" disabled>
                    {isActive ? "Plan Aktif" : "Free"}
                  </Button>
                ) : (
                  <PricingCheckoutButton plan={plan} disabled={isActive} />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
