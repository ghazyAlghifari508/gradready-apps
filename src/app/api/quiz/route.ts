import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { callAI, parseAIJSON } from "@/lib/ai";

export const dynamic = "force-dynamic";

interface QuizQuestionData {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

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
      // Return a list of skills user can take quiz on
      const skillProgress = await prisma.userSkillProgress.findMany({
        where: { userId: session.user.id },
        include: { skill: true }
      });
      return NextResponse.json({ success: true, skills: skillProgress });
    }

    // Try fetching existing questions for this skill
    let questions = await prisma.quizQuestion.findMany({
      where: { skillId },
      take: 5, // We just need 5 questions for a quick quiz
    });

    const skillInfo = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skillInfo) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // If no questions in DB, generate them using AI on the fly, then save!
    if (questions.length < 5) {
      const systemPrompt = `You are a technical assessment creator. 
Generate 5 multiple-choice questions for the skill: "${skillInfo.name}" (${skillInfo.category}).
Difficulty should be intermediate.
Return exclusively a VALID JSON object of this shape:
{
  "questions": [
    {
      "questionText": "string",
      "options": ["string", "string", "string", "string"], (exactly 4 options)
      "correctOptionIndex": number (0 to 3),
      "explanation": "string"
    }
  ]
}`;
      const rawPrompt = `Generate the quiz questions for ${skillInfo.name} now.`;
      
      const aiRaw = await callAI(rawPrompt, { systemPrompt, format: "json", temperature: 0.4 });
      const generated = parseAIJSON<{ questions: QuizQuestionData[] }>(aiRaw);

      if (generated && generated.questions && generated.questions.length > 0) {
        // Save to DB
        await prisma.quizQuestion.createMany({
          data: generated.questions.map((q) => ({
            skillId,
            questionText: q.questionText,
            optionsJson: q.options,
            correctAnswer: q.correctOptionIndex.toString(),
            explanation: q.explanation || "Correct answer.",
          }))
        });

        // Refetch
        questions = await prisma.quizQuestion.findMany({
          where: { skillId },
          take: 5,
        });
      }
    }

    // Clean payload for client (exclude correctOptionIndex so they don't cheat)
    const clientQuestions = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.optionsJson as string[], // type cast from jsonb
    }));

    return NextResponse.json({ 
      success: true, 
      skill: skillInfo, 
      questions: clientQuestions 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Quiz API Error:", message);
    return NextResponse.json({ error: "Internal Server Error", message }, { status: 500 });
  }
}
