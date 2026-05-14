import { NextResponse } from "next/server";
import type { Plan } from "@/generated/prisma/client";

export class QuotaExceededError extends Error {
  constructor(
    public readonly details: {
      plan: Plan;
      used: number;
      limit: number;
      upgradeUrl: string;
    },
  ) {
    super("AI credit quota exceeded");
    this.name = "QuotaExceededError";
  }
}

export function apiError(
  status: number,
  code: string,
  publicMessage: unknown = code,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message: publicMessage,
      },
    },
    { status },
  );
}

export function handleApiError(error: unknown, requestId = crypto.randomUUID()) {
  console.error(`[api-error:${requestId}]`, error);

  if (error instanceof QuotaExceededError) {
    const response = apiError(402, "QUOTA_EXCEEDED", error.details);
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const response = apiError(500, "INTERNAL_ERROR", "Internal server error");
  response.headers.set("x-request-id", requestId);
  return response;
}
