import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { callAI, parseAIJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer } = await req.json();

    if (!question || !answer || answer.length < 10) {
      return NextResponse.json({ error: "Silakan masukkan jawaban yang lebih panjang." }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, evaluation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Mock Interview Evaluation API Error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
