"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import type { BillingInterval } from "@/lib/plans";

export default function PricingCheckoutButton({
  interval,
  disabled = false,
  label,
}: {
  interval: BillingInterval;
  disabled?: boolean;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const startCheckout = async () => {
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
    <Button type="button" variant="primary" className="w-full" disabled={disabled || loading} onClick={startCheckout}>
      {disabled ? "Plan Aktif" : loading ? "Membuka Checkout..." : label ?? "Mulai Sekarang"}
    </Button>
  );
}
