import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertProFeature, consumeCredit } from "@/lib/billing";
import { callAI } from "@/lib/ai";
import { handleApiError, apiError } from "@/lib/errors";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma, type DocType } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const reviseSchema = z.object({
  docId: z.string().min(1),
  instruction: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = reviseSchema.safeParse(await req.json().catch(() => undefined));
    if (!body.success) return apiError(400, "INVALID_PAYLOAD", body.error.issues);

    const sub = await assertProFeature(session.user.id);

    const original = await prisma.generatedDoc.findFirst({
      where: { id: body.data.docId, userId: session.user.id },
      select: { id: true, contentText: true, docType: true, inputJson: true },
    });
    if (!original) return apiError(404, "NOT_FOUND", "Document not found");

    const raw = await callAI(
      `You are an expert career document writer. Revise the document below based on the user instruction.
Instruction: "${body.data.instruction}"
Original document:
${original.contentText}
Return ONLY valid JSON: {"contentText":"revised document text"}`,
      {
        systemPrompt: 'You are an expert career document writer. Return valid JSON: {"contentText":"..."}',
        format: "json",
        maxTokens: 2500,
        temperature: 0.7,
      },
    );

    let contentText: string;
    try {
      contentText = (JSON.parse(raw) as { contentText: string }).contentText;
    } catch {
      return apiError(500, "AI_PARSE_ERROR", "AI returned invalid response");
    }

    const revised = await prisma.generatedDoc.create({
      data: {
        userId: session.user.id,
        docType: original.docType as DocType,
        contentText,
        inputJson: original.inputJson as Prisma.InputJsonValue | undefined,
      },
    });

    await consumeCredit(session.user.id, "DOC_REVISE", sub);
    return NextResponse.json({ success: true, doc: revised });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
