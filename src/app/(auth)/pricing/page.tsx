import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PLAN_LIMITS, PRO_PRICING } from "@/lib/plans";
import { Badge, Card } from "@/components/ui";
import PricingProCard from "./PricingProCard";
import { getActiveSubscription } from "@/lib/billing";
import { formatIDR } from "@/lib/format";

export const metadata = { title: "Pricing - GradReady" };

export default async function PricingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const sub = await getActiveSubscription(session.user.id);
  const isPro = sub?.plan !== "FREE" && sub?.plan !== undefined;

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
            Pilih Paket GradReady
          </h1>
          <p style={{ color: "var(--gray-light)", fontWeight: 700, margin: 0 }}>
            Mulai gratis. Upgrade kapanpun untuk akses semua fitur AI karir tanpa
            batas.
          </p>
        </div>
        <Link
          href="/billing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 44,
            padding: "0 18px",
            borderRadius: 12,
            backgroundColor: "var(--blue)",
            color: "#fff",
            fontWeight: 900,
            textDecoration: "none",
            textTransform: "uppercase",
            boxShadow: "0 4px 0 var(--blue-shadow)",
          }}
        >
          Lihat Langganan
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <Card style={{ borderColor: !isPro ? "var(--green)" : "var(--border-color)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--dark-blue)", margin: 0 }}>Free</h2>
                {!isPro && <Badge variant="completed">Aktif</Badge>}
              </div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: "var(--dark-blue)" }}>
                Rp 0
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800, color: "var(--gray-light)" }}>/bulan</span>
              </div>
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, padding: 0, margin: 0, listStyle: "none", flex: 1 }}>
              {PLAN_LIMITS.FREE.features.map((f) => (
                <li key={f} style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-text)" }}>✓ {f}</li>
              ))}
              <li style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>✗ AI Doc Builder (diblok)</li>
            </ul>
            <button
              disabled
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "none",
                backgroundColor: "var(--gray-light)",
                color: "#fff",
                fontWeight: 900,
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            >
              {!isPro ? "Plan Aktif" : "Free"}
            </button>
          </div>
        </Card>

        <PricingProCard isPro={isPro} />
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--gray-light)", fontWeight: 700 }}>
        Sudah Pro?{" "}
        <Link href="/billing" style={{ color: "var(--blue)", textDecoration: "underline" }}>
          Lihat status langganan
        </Link>
      </p>
    </div>
  );
}
