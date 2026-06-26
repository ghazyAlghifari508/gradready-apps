import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { callAI, parseAIJSON } from "@/lib/ai";
import { assertAiQuota, consumeCredit } from "@/lib/billing";
import { handleApiError } from "@/lib/errors";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSubscription = await assertAiQuota(
      session.user.id,
      "MOCK_INTERVIEW",
    );

    const bodySchema = z.object({
      question: z.string().min(10).max(500),
      answer: z.string().min(10).max(2000),
    });
    const body = bodySchema.safeParse(await req.json().catch(() => null));
    if (!body.success) return NextResponse.json({ error: "Silakan masukkan jawaban yang lebih panjang." }, { status: 400 });
    const { question, answer } = body.data;

    const systemPrompt = `You are an expert HR Interviewer evaluating a candidate's answer to a behavioral question.
Analyze their response using the STAR method (Situation, Task, Action, Result) if applicable, or general communication clarity.
Return valid JSON exclusively with this shape:
{
  "score": number (0-10),
  "feedback": "string" (constructive feedback on what was good and what was missing),
  "improvedAnswer": "string" (an example of a 10/10 answer based on what the candidate provided)
}`;

    const userPrompt = `Question: "${question}"\n\nCandidate's Answer:\n"${answer}"`;

    const rawResponse = await callAI(userPrompt, {
      systemPrompt,
      format: "json",
      temperature: 0.3,
      maxTokens: 800,
    });

    const evaluation = parseAIJSON(rawResponse);

    await consumeCredit(session.user.id, "MOCK_INTERVIEW", activeSubscription);

    return NextResponse.json({ success: true, evaluation });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
