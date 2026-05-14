"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useToast } from "@/components/ui/Toast";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [adminClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: unknown;
  };
};

export function isQuotaExceededError(data: unknown): data is ApiErrorPayload {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    (data as ApiErrorPayload).error?.code === "QUOTA_EXCEEDED"
  );
}

export function getApiErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as ApiErrorPayload).error?.message === "string"
  ) {
    return (data as ApiErrorPayload).error?.message as string;
  }

  if (typeof data === "object" && data !== null && "error" in data) {
    const error = (data as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }

  return fallback;
}

export function useQuotaExceededHandler() {
  const router = useRouter();
  const { showToast } = useToast();

  return useCallback((data: unknown) => {
    if (!isQuotaExceededError(data)) {
      return false;
    }

    const upgradeUrl =
      typeof data.error?.message === "object" &&
      data.error.message !== null &&
      "upgradeUrl" in data.error.message &&
      typeof (data.error.message as { upgradeUrl?: unknown }).upgradeUrl ===
        "string"
        ? (data.error.message as { upgradeUrl: string }).upgradeUrl
        : "/pricing";

    showToast("Kredit AI kamu habis untuk periode ini", "warning", {
      label: "Upgrade",
      onClick: () => router.push(upgradeUrl),
    });
    return true;
  }, [router, showToast]);
}
