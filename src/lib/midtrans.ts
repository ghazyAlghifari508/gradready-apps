import "server-only";

import { createHash } from "node:crypto";
import type { SubscriptionStatus } from "@/generated/prisma/client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_BASE = isProduction
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1";

type SnapCustomer = {
  firstName: string;
  email: string;
};

type SnapItemDetail = {
  id: string;
  price: number;
  quantity: number;
  name: string;
};

type SnapCallbacks = {
  finish?: string;
  error?: string;
  pending?: string;
};

export type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  transaction_id?: string;
  payment_type?: string;
  [key: string]: unknown;
};

function getServerKey() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is not configured");
  }
  return serverKey;
}

export async function createSnapTransaction({
  orderId,
  grossAmount,
  customer,
  itemDetails,
  callbacks,
}: {
  orderId: string;
  grossAmount: number;
  customer: SnapCustomer;
  itemDetails: SnapItemDetail[];
  callbacks?: SnapCallbacks;
}) {
  const serverKey = getServerKey();
  const response = await fetch(`${SNAP_BASE}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer.firstName,
        email: customer.email,
      },
      item_details: itemDetails,
      callbacks,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Midtrans Snap error ${response.status}: ${JSON.stringify(data)}`);
  }

  return {
    token: data.token as string,
    redirectUrl: data.redirect_url as string,
  };
}

export function verifyNotificationSignature(notif: MidtransNotification) {
  const serverKey = getServerKey();
  const expected = createHash("sha512")
    .update(
      `${notif.order_id ?? ""}${notif.status_code ?? ""}${notif.gross_amount ?? ""}${serverKey}`,
    )
    .digest("hex");

  return notif.signature_key === expected;
}

export function mapNotificationToStatus(
  notif: MidtransNotification,
): SubscriptionStatus {
  const transactionStatus = notif.transaction_status;
  const fraudStatus = notif.fraud_status;

  if (transactionStatus === "settlement") {
    return "ACTIVE";
  }

  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "ACTIVE" : "PENDING";
  }

  if (transactionStatus === "pending") {
    return "PENDING";
  }

  if (transactionStatus === "expire") {
    return "EXPIRED";
  }

  if (transactionStatus === "cancel") {
    return "CANCELED";
  }

  if (transactionStatus === "deny" || transactionStatus === "failure") {
    return "FAILED";
  }

  return "FAILED";
}
