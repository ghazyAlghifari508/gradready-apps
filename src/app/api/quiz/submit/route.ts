import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SkillStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // answers format: { questionId: string, selectedIndex: number }[]
    const { skillId, answers } = await req.json();

    if (!skillId || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Fetch correct answers
    const questionIds = answers.map((a: QuizAnswer) => a.questionId);
    const dbQuestions = await prisma.quizQuestion.findMany({
      where: { id: { in: questionIds } },
    });

    let correctCount = 0;
    const feedback = [];

    for (const ans of answers) {
      const q = dbQuestions.find((dbq) => dbq.id === ans.questionId);
      if (q) {
        const isCorrect = q.correctAnswer === ans.selectedIndex.toString();
        if (isCorrect) correctCount++;
        feedback.push({
          questionId: q.id,
          isCorrect,
          correctOptionIndex: parseInt(q.correctAnswer),
          explanation: q.explanation,
        });
      }
    }

    const total = dbQuestions.length;
    const scorePercentage = total > 0 ? (correctCount / total) * 100 : 0;

    // Update UserSkillProgress
    const passThreshold = 80;
    const passed = scorePercentage >= passThreshold;

    let updatedProgress = null;
    const currentProgress = await prisma.userSkillProgress.findUnique({
      where: { userId_skillId: { userId: session.user.id, skillId } }
    });

    if (currentProgress) {
        const newScore = Math.max(currentProgress.quizScore || 0, scorePercentage);
        updatedProgress = await prisma.userSkillProgress.update({
             where: { id: currentProgress.id },
             data: {
                  quizScore: newScore,
                  status: passed ? SkillStatus.GREEN : currentProgress.status, // ONLY upgrade to GREEN if passed
             }
        });
    }

    return NextResponse.json({ 
      success: true, 
      scorePercentage, 
      passed, 
      feedback,
      updatedProgress 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Quiz Submit API Error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
