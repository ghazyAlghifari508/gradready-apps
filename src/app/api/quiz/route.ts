import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { callAI, parseAndValidateAIJSON } from "@/lib/ai";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { apiError, handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

const quizGenerationSchema = z
  .object({
    questions: z
      .array(
        z
          .object({
            questionText: z.string().min(1).max(500),
            options: z.array(z.string().min(1).max(200)).length(4),
            correctOptionIndex: z.number().int().min(0).max(3),
            explanation: z.string().max(1000).optional(),
          })
          .strict(),
      )
      .min(5),
  })
  .strict();

type QuizGeneration = z.infer<typeof quizGenerationSchema>;

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId");

    if (!skillId) {
      const skillProgress = await prisma.userSkillProgress.findMany({
        where: { userId: session.user.id },
        include: { skill: true },
      });
      return NextResponse.json({ success: true, skills: skillProgress });
    }

    const skillInfo = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skillInfo) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const existingQuestionCount = await prisma.quizQuestion.count({
      where: { skillId },
    });

    let questions = await prisma.quizQuestion.findMany({
      where: { skillId },
      orderBy: { id: "asc" },
      take: 5,
    });

    if (questions.length < 5 && existingQuestionCount < 20) {
      const systemPrompt = `You are a technical assessment creator. 
Generate 5 multiple-choice questions for the skill: "${skillInfo.name}" (${skillInfo.category}).
Difficulty should be intermediate.
Return exclusively a VALID JSON object of this shape:
{
  "questions": [
    {
      "questionText": "string",
      "options": ["string", "string", "string", "string"],
      "correctOptionIndex": number (0 to 3),
      "explanation": "string"
    }
  ]
}`;
      const rawPrompt = `Generate the quiz questions for ${skillInfo.name} now.`;

      let generated: QuizGeneration | null = null;
      for (const temperature of [0.4, 0.1]) {
        try {
          const aiRaw = await callAI(rawPrompt, {
            systemPrompt,
            format: "json",
            temperature,
          });
          generated = parseAndValidateAIJSON(aiRaw, quizGenerationSchema);
          break;
        } catch (error) {
          console.warn("Quiz generation parse failed:", error);
        }
      }

      if (!generated) {
        return apiError(503, "QUIZ_GEN_FAILED");
      }

      questions = await prisma.$transaction(
        async (tx) => {
          const questionCount = await tx.quizQuestion.count({
            where: { skillId },
          });
          const currentQuestions = await tx.quizQuestion.findMany({
            where: { skillId },
            orderBy: { id: "asc" },
            take: 5,
          });

          if (currentQuestions.length >= 5 || questionCount >= 20) {
            return currentQuestions;
          }

          await tx.quizQuestion.createMany({
            data: generated.questions.map((q) => ({
              skillId,
              questionText: q.questionText,
              optionsJson: q.options,
              correctAnswer: q.correctOptionIndex.toString(),
              explanation: q.explanation || "Correct answer.",
            })),
            skipDuplicates: true,
          });

          return tx.quizQuestion.findMany({
            where: { skillId },
            orderBy: { id: "asc" },
            take: 5,
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    }

    const clientQuestions = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.optionsJson as string[], // type cast from jsonb
    }));

    return NextResponse.json({
      success: true,
      skill: skillInfo,
      questions: clientQuestions,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
