// lib/ai.ts — OpenRouter AI wrapper
// Phase 2: CV Analyzer

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

const PRIMARY_MODEL = "deepseek/deepseek-r1:free";
const FALLBACK_MODEL = "meta-llama/llama-3.1-8b-instruct:free";

export interface AICallOptions {
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  format?: "json" | "text";
}

/**
 * Call OpenRouter API with a user prompt.
 * Falls back to secondary model on failure.
 */
export async function callAI(
  prompt: string,
  options: AICallOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "sk-or-placeholder") {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const {
    systemPrompt = "You are a professional CV analyst. Always respond in valid JSON only, no markdown, no explanation outside the JSON.",
    model = PRIMARY_MODEL,
    maxTokens = 2000,
    temperature = 0.3,
    format = "json",
  } = options;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  async function fetchCompletion(modelId: string): Promise<string> {
    const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "GradReady CV Analyzer",
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        max_tokens: maxTokens,
        temperature,
        ...(format === "json" ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  try {
    return await fetchCompletion(model);
  } catch (primaryError) {
    console.warn(`Primary model (${model}) failed, trying fallback...`, primaryError);
    try {
      return await fetchCompletion(FALLBACK_MODEL);
    } catch (fallbackError) {
      throw new Error(`Both AI models failed. Last error: ${fallbackError}`);
    }
  }
}

/**
 * Parse AI response — extracts JSON even if wrapped in markdown code blocks.
 */
export function parseAIJSON<T = Record<string, unknown>>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
