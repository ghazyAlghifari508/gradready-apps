import { z } from "zod";

const NIM_BASE = "https://integrate.api.nvidia.com/v1";

const PRIMARY_MODEL = "meta/llama-4-maverick-17b-128e-instruct";
const FALLBACK_MODEL = "openai/gpt-oss-120b";
const FALLBACK_MODEL_2 = "qwen/qwen3-next-80b-a3b-instruct";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_PRIMARY_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 250;

export interface AICallOptions {
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  format?: "json" | "text";
  timeoutMs?: number;
}

export class AIHTTPError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = "AIHTTPError";
  }
}

export class AIInvalidResponseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AIInvalidResponseError";
  }
}

export interface AICallMetric {
  count: number;
  model: string;
  latency: number;
  status: number | string;
}

const aiMetricCounts = new Map<string, number>();

export function logAICallMetric(
  metric: Omit<AICallMetric, "count">,
): AICallMetric {
  const key = `${metric.model}:${metric.status}`;
  const count = (aiMetricCounts.get(key) ?? 0) + 1;
  aiMetricCounts.set(key, count);

  const structuredMetric = { count, ...metric };
  console.info("[ai.call]", structuredMetric);
  return structuredMetric;
}

export async function callAI(
  prompt: string,
  options: AICallOptions = {},
): Promise<string> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey || apiKey === "nvapi-placeholder") {
    throw new Error("NVIDIA_NIM_API_KEY is not configured");
  }

  const {
    systemPrompt = "You are a professional CV analyst. Always respond in valid JSON only, no markdown, no explanation outside the JSON.",
    model = PRIMARY_MODEL,
    maxTokens = 2000,
    temperature = 0.3,
    format = "json",
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  async function fetchCompletion(modelId: string): Promise<string> {
    const start = Date.now();
    try {
      const response = await fetch(`${NIM_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelId,
          messages,
          max_tokens: maxTokens,
          temperature,
          ...(format === "json"
            ? { response_format: { type: "json_object" } }
            : {}),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        const err = await response.text();
        const retryAfterMs = parseRetryAfterMs(
          response.headers.get("Retry-After"),
        );
        logAICallMetric({
          model: modelId,
          latency: Date.now() - start,
          status: response.status,
        });
        throw new AIHTTPError(
          `NVIDIA NIM error ${response.status}: ${err}`,
          response.status,
          retryAfterMs,
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (typeof content !== "string" || content.trim().length === 0) {
        throw new AIInvalidResponseError("NVIDIA NIM returned empty content");
      }

      logAICallMetric({
        model: modelId,
        latency: Date.now() - start,
        status: response.status,
      });
      return content;
    } catch (error) {
      if (!(error instanceof AIHTTPError)) {
        logAICallMetric({
          model: modelId,
          latency: Date.now() - start,
          status:
            error instanceof AIInvalidResponseError
              ? "invalid_response"
              : isAbortError(error)
                ? "abort"
                : "network_error",
        });
      }
      throw error;
    }
  }

  try {
    return await fetchWithRetry(model);
  } catch (primaryError) {
    if (
      model === FALLBACK_MODEL ||
      model === FALLBACK_MODEL_2 ||
      !shouldRetry(primaryError)
    ) {
      throw primaryError;
    }

    console.warn(
      `Primary model (${model}) exhausted, trying fallbacks...`,
      primaryError,
    );
    try {
      return await fetchCompletion(FALLBACK_MODEL);
    } catch (fallbackError) {
      console.warn(
        `Fallback model (${FALLBACK_MODEL}) failed, trying last fallback...`,
        fallbackError,
      );
      try {
        return await fetchCompletion(FALLBACK_MODEL_2);
      } catch (fallback2Error) {
        throw new Error(`All AI models failed. Last error: ${fallback2Error}`);
      }
    }
  }

  async function fetchWithRetry(modelId: string): Promise<string> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_PRIMARY_RETRIES; attempt++) {
      try {
        return await fetchCompletion(modelId);
      } catch (error) {
        lastError = error;

        if (!shouldRetry(error) || attempt === MAX_PRIMARY_RETRIES) {
          throw error;
        }

        await sleep(getRetryDelayMs(error, attempt));
      }
    }

    throw lastError;
  }
}

export function parseAIJSON<T = Record<string, unknown>>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

export function parseAndValidateAIJSON<TSchema extends z.ZodType>(
  raw: string,
  schema: TSchema,
): z.infer<TSchema>;
export function parseAndValidateAIJSON<T>(
  raw: string,
  schema: z.ZodType<T>,
): T;
export function parseAndValidateAIJSON(
  raw: string,
  schema: z.ZodType,
): unknown {
  let parsed: unknown;

  try {
    parsed = parseAIJSON<unknown>(raw);
  } catch (error) {
    throw new AIInvalidResponseError("AI response was not valid JSON", error);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new AIInvalidResponseError(
      "AI response did not match the expected schema",
      result.error,
    );
  }

  return result.data;
}

function shouldRetry(error: unknown): boolean {
  if (isAbortError(error)) {
    return false;
  }

  if (!(error instanceof AIHTTPError)) {
    return false;
  }

  return error.status === 429 || error.status >= 500;
}

function getRetryDelayMs(error: unknown, retryIndex: number): number {
  if (error instanceof AIHTTPError && error.status === 429) {
    return error.retryAfterMs ?? withJitter(BASE_RETRY_DELAY_MS);
  }

  return withJitter(BASE_RETRY_DELAY_MS * 2 ** retryIndex);
}

function parseRetryAfterMs(value: string | null): number | undefined {
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const retryAt = Date.parse(value);
  if (Number.isFinite(retryAt)) {
    return Math.max(0, retryAt - Date.now());
  }

  return undefined;
}

function withJitter(delayMs: number): number {
  return delayMs + Math.floor(Math.random() * 100);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}
