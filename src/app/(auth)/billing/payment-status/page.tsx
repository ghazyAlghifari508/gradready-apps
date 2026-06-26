import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Payment Status - GradReady" };

type PaymentSearchParams = Record<string, string | string[] | undefined>;

function readParam(params: PaymentSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentStatusPage({
  searchParams,
}: {
  searchParams: Promise<PaymentSearchParams>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const orderId = readParam(params, "order_id");

  let dbStatus = "pending";
  if (orderId) {
    const sub = await prisma.subscription.findUnique({
      where: { midtransOrderId: orderId },
      select: { status: true },
    });
    if (sub) dbStatus = sub.status.toLowerCase();
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 32px" }}>
      <div style={{ background: "#FFFFFF", border: "2px solid var(--border-color)", borderRadius: 16, padding: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "var(--dark-blue)", marginBottom: 8 }}>
              Status Pembayaran
            </h1>
            <p style={{ color: "var(--gray-light)", fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
              {dbStatus === "active"
                ? "Pembayaran berhasil! Langganan Anda sudah aktif."
                : "Pembayaran sedang diproses. Aktivasi plan terjadi setelah webhook Midtrans berhasil diterima."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 12, backgroundColor: "var(--bg-gray)" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--gray-light)" }}>ORDER ID</div>
              <div style={{ fontWeight: 900, color: "var(--dark-blue)" }}>{orderId ?? "-"}</div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, backgroundColor: "var(--bg-gray)" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--gray-light)" }}>STATUS</div>
              <div style={{ fontWeight: 900, color: dbStatus === "active" ? "var(--green)" : "var(--gray-light)" }}>
                {dbStatus === "active" ? "BERHASIL" : dbStatus.toUpperCase()}
              </div>
            </div>
          </div>
          <a href="/billing"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 44, padding: "0 18px", borderRadius: 12, backgroundColor: "var(--green)", color: "#fff", fontWeight: 900, textDecoration: "none", textTransform: "uppercase", boxShadow: "0 4px 0 var(--green-shadow)", alignSelf: "flex-start" }}>
            Lihat Billing
          </a>
        </div>
      </div>
    </div>
  );
}
