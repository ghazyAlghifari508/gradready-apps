import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRemainingCredits } from "@/lib/billing";
import CreditUsageCard from "@/components/billing/CreditUsageCard";
import { Badge, Card } from "@/components/ui";

export const metadata = {
  title: "Billing - GradReady",
};

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const [usage, subscriptions] = await Promise.all([
    getRemainingCredits(userId),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 32,
              color: "var(--dark-blue)",
              marginBottom: 8,
            }}
          >
            Billing & Credits
          </h1>
          <p style={{ color: "var(--gray-light)", fontWeight: 700, margin: 0 }}>
            Pantau kredit AI dan riwayat langganan GradReady.
          </p>
        </div>
        <Link
          href="/pricing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 44,
            padding: "0 18px",
            borderRadius: 12,
            backgroundColor: "var(--green)",
            color: "#fff",
            fontWeight: 900,
            textDecoration: "none",
            textTransform: "uppercase",
            boxShadow: "0 4px 0 var(--green-shadow)",
          }}
        >
          Kelola / Upgrade
        </Link>
      </div>

      <div style={{ maxWidth: 420, marginBottom: 28 }}>
        <CreditUsageCard
          plan={usage.plan}
          used={usage.used}
          limit={usage.limit}
          periodEnd={usage.periodEnd}
        />
      </div>

      <Card>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "var(--dark-blue)",
            marginBottom: 18,
          }}
        >
          Riwayat Langganan
        </h2>

        {subscriptions.length === 0 ? (
          <p style={{ color: "var(--gray-light)", fontWeight: 700, margin: 0 }}>
            Belum ada transaksi langganan.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 720,
              }}
            >
              <thead>
                <tr style={{ textAlign: "left", color: "var(--gray-light)" }}>
                  <th style={{ padding: "10px 12px", fontSize: 12 }}>Plan</th>
                  <th style={{ padding: "10px 12px", fontSize: 12 }}>Status</th>
                  <th style={{ padding: "10px 12px", fontSize: 12 }}>Periode</th>
                  <th style={{ padding: "10px 12px", fontSize: 12 }}>Nominal</th>
                  <th style={{ padding: "10px 12px", fontSize: 12 }}>Order ID</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr
                    key={subscription.id}
                    style={{ borderTop: "1px solid var(--border-color)" }}
                  >
                    <td style={{ padding: "12px", fontWeight: 900 }}>
                      {subscription.plan}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <Badge
                        variant={
                          subscription.status === "ACTIVE"
                            ? "completed"
                            : subscription.status === "PENDING"
                              ? "in-progress"
                              : "failed"
                        }
                      >
                        {subscription.status}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "var(--gray-text)",
                        fontWeight: 700,
                      }}
                    >
                      {formatDate(subscription.periodStart)} -{" "}
                      {formatDate(subscription.periodEnd)}
                    </td>
                    <td style={{ padding: "12px", fontWeight: 800 }}>
                      {formatIDR(subscription.grossAmount)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "var(--gray-light)",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {subscription.midtransOrderId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
