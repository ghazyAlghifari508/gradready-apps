import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertFeatureQuota, consumeCredit } from "@/lib/billing";
import { callAI, parseAIJSON } from "@/lib/ai";
import { handleApiError, apiError } from "@/lib/errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reviseSchema = z.object({
  cvData: z.unknown(),
  instruction: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = reviseSchema.safeParse(await req.json().catch(() => undefined));
    if (!body.success) return apiError(400, "INVALID_PAYLOAD", body.error.issues);

    const sub = await assertFeatureQuota(session.user.id, "CV_REVISE");

    const prompt = `You are an expert CV editor. User instruction: "${body.data.instruction}"
Current CV JSON: ${JSON.stringify(body.data.cvData)}
Return ONLY a valid JSON object with the SAME schema as the input with the requested changes applied. No placeholders.`;

    const raw = await callAI(prompt, {
      systemPrompt: "You are an expert CV editor. Return valid JSON only, same schema as input.",
      format: "json",
      maxTokens: 2000,
      temperature: 0.5,
    });

    const revised = parseAIJSON(raw);
    await consumeCredit(session.user.id, "CV_REVISE", sub);

    return NextResponse.json({ revised });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
