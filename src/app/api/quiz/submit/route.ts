import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma, SkillStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const quizSubmitSchema = z.object({
  skillId: z.string().cuid(),
  answers: z
    .array(
      z.object({
        questionId: z.string().cuid(),
        selectedIndex: z.number().int().min(0),
      }),
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = quizSubmitSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { skillId, answers } = parsed.data;

    const dbQuestions = await prisma.quizQuestion.findMany({
      where: { id: { in: answers.map((a) => a.questionId) } },
    });

    let correctCount = 0;
    const feedback = [];

    for (const ans of answers) {
      const q = dbQuestions.find((dbq) => dbq.id === ans.questionId);
      if (q) {
        const correctIndex = Number.parseInt(q.correctAnswer, 10);
        const isCorrect =
          !Number.isNaN(correctIndex) && correctIndex === ans.selectedIndex;
        if (isCorrect) correctCount++;
        feedback.push({
          questionId: q.id,
          isCorrect,
          correctOptionIndex: Number.isNaN(correctIndex) ? 0 : correctIndex,
          explanation: q.explanation,
        });
      }
    }

    const total = dbQuestions.length;
    const scorePercentage =
      total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = scorePercentage >= 80;

    // Atomic upsert prevents:
    // 1. Race condition: two concurrent submissions clobbering each other's best score
    // 2. Silent no-op: first-time users had no row, so the old conditional update was skipped
    const updatedProgress = await prisma.$transaction(
      async (tx) => {
        const current = await tx.userSkillProgress.findUnique({
          where: { userId_skillId: { userId: session.user.id, skillId } },
          select: { quizScore: true },
        });

        const bestScore = Math.max(current?.quizScore ?? 0, scorePercentage);

        return tx.userSkillProgress.upsert({
          where: { userId_skillId: { userId: session.user.id, skillId } },
          create: {
            userId: session.user.id,
            skillId,
            quizScore: scorePercentage,
            status: passed ? SkillStatus.GREEN : SkillStatus.RED,
          },
          update: {
            quizScore: bestScore,
            ...(passed && { status: SkillStatus.GREEN }),
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return NextResponse.json({
      success: true,
      scorePercentage,
      passed,
      feedback,
      updatedProgress,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Quiz Submit API Error:", message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
