"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

export default function PricingCheckoutButton({
  plan,
  disabled = false,
}: {
  plan: "PRO" | "PLUS";
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!res.ok || !data.redirectUrl) {
        throw new Error(
          data?.error?.message || "Gagal membuat transaksi pembayaran.",
        );
      }

      window.location.href = data.redirectUrl;
    } catch (error: unknown) {
      showToast(
        error instanceof Error ? error.message : "Gagal membuat checkout.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="primary"
      className="w-full"
      disabled={disabled || loading}
      onClick={startCheckout}
    >
      {disabled ? "Plan Aktif" : loading ? "Membuka Checkout..." : "Upgrade"}
    </Button>
  );
}
