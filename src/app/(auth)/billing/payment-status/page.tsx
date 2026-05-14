import Link from "next/link";
import { Card } from "@/components/ui";

export const metadata = {
  title: "Payment Status - GradReady",
};

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
  const params = await searchParams;
  const orderId = readParam(params, "order_id") ?? "-";
  const transactionStatus =
    readParam(params, "transaction_status") ??
    readParam(params, "status_code") ??
    "pending";

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 32px" }}>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h1
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 30,
                color: "var(--dark-blue)",
                marginBottom: 8,
              }}
            >
              Status Pembayaran
            </h1>
            <p
              style={{
                color: "var(--gray-light)",
                fontWeight: 700,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Pembayaran sedang diproses. Aktivasi plan terjadi setelah webhook
              Midtrans berhasil diterima.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: "var(--bg-gray)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--gray-light)" }}>
                ORDER ID
              </div>
              <div style={{ fontWeight: 900, color: "var(--dark-blue)" }}>
                {orderId}
              </div>
            </div>
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: "var(--bg-gray)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--gray-light)" }}>
                STATUS
              </div>
              <div style={{ fontWeight: 900, color: "var(--dark-blue)" }}>
                {transactionStatus}
              </div>
            </div>
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
              backgroundColor: "var(--green)",
              color: "#fff",
              fontWeight: 900,
              textDecoration: "none",
              textTransform: "uppercase",
              boxShadow: "0 4px 0 var(--green-shadow)",
              alignSelf: "flex-start",
            }}
          >
            Lihat Billing
          </Link>
        </div>
      </Card>
    </div>
  );
}
