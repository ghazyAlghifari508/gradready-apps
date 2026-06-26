"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { Button } from "@/components/ui";
import { formatIDR } from "@/lib/format";
import { PRO_PRICING, type BillingInterval } from "@/lib/plans";
import { useToast } from "@/components/ui/Toast";

export default function PricingProCard({ isPro }: { isPro: boolean }) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const config = PRO_PRICING[interval];

  const startCheckout = async () => {
    if (isPro) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data?.error?.message || "Gagal membuat transaksi pembayaran.");
      }
      if (!/^https?:\/\//i.test(data.redirectUrl)) throw new Error("URL pembayaran tidak valid.");
      window.location.href = data.redirectUrl;
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : "Gagal membuat checkout.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ borderColor: isPro ? "var(--green)" : "#FFC800", boxShadow: "0 4px 24px rgba(255,200,0,0.15)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--dark-blue)", margin: 0 }}>Pro</h2>
            <Badge variant={isPro ? "completed" : "premium"}>{isPro ? "Aktif" : "Populer"}</Badge>
          </div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: "var(--dark-blue)" }}>
            {formatIDR(interval === "yearly" ? Math.round(config.priceIDR / 12) : config.priceIDR)}
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800, color: "var(--gray-light)" }}>
              /{interval === "monthly" ? "bulan" : "tahun"}
            </span>
          </div>
          {interval === "yearly" && (
            <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 900, marginTop: 2 }}>
              Hemat 2 bulan! Cuma {formatIDR(Math.round(config.priceIDR / 12))}/bulan
            </p>
          )}
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: interval === "monthly" ? "var(--dark-blue)" : "var(--gray-light)" }}>Bulanan</span>
          <button type="button" onClick={() => setInterval(interval === "monthly" ? "yearly" : "monthly")}
            style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: interval === "yearly" ? "var(--green)" : "var(--border-color)", border: "none", padding: 0, cursor: "pointer", position: "relative", transition: "background-color 0.2s", flexShrink: 0 }}
            aria-label="Toggle billing interval">
            <span style={{ position: "absolute", top: 3, left: interval === "yearly" ? 23 : 3, width: 22, height: 22, borderRadius: "50%", backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transition: "left 0.2s" }} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 800, color: interval === "yearly" ? "var(--dark-blue)" : "var(--gray-light)" }}>
            Tahunan <span style={{ color: "var(--green)" }}>Hemat</span>
          </span>
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 10, padding: 0, margin: 0, listStyle: "none", flex: 1 }}>
          {["Unlimited generate & revisi CV", "Semua fitur AI Doc Builder", "Motivation Letter, Cover Letter, LinkedIn & lebih", "Prioritas support"].map((f) => (
            <li key={f} style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-text)" }}>✓ {f}</li>
          ))}
        </ul>

        {isPro ? (
          <button disabled style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", backgroundColor: "var(--gray-light)", color: "#fff", fontWeight: 900, cursor: "not-allowed", opacity: 0.6 }}>
            Plan Aktif
          </button>
        ) : (
          <Button type="button" variant="primary" className="w-full" disabled={loading} onClick={startCheckout}>
            {loading ? "Membuka Checkout..." : `Mulai ${interval === "monthly" ? "Bulanan" : "Tahunan"}`}
          </Button>
        )}
      </div>
    </Card>
  );
}
