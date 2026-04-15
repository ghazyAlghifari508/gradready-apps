import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { callAI, parseAIJSON } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobDescription } = await req.json();

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json({ error: "Please provide a valid job description (min 50 chars)." }, { status: 400 });
    }

    // Fetch latest CV parsed skills
    const latestCv = await prisma.cvRecord.findFirst({
      where: { userId: session.user.id, isLatest: true },
    });

    const userSkills = latestCv?.parsedSkills 
      ? (latestCv.parsedSkills as string[]).join(", ") 
      : "No specific skills recorded.";

    const systemPrompt = `You are an expert ATS and recruitment AI.
You will be provided with a candidate's skills and a Job Description.
Compare the two and return exclusively a JSON object adhering to this shape:
{
  "fitScore": number (0-100 representing percentage of match),
  "matchingSkills": string[] (skills candidate has that are required/relevant to JD),
  "missingSkills": string[] (important skills in JD that candidate lacks),
  "recommendations": string (1-2 brief paragraphs advising how to bridge the gap or tailor CV)
}
Respond ONLY in valid JSON.`;

    const userPrompt = `Candidate Skills: ${userSkills}\n\nJob Description:\n${jobDescription}`;

    const rawAIResponse = await callAI(userPrompt, {
      systemPrompt,
      format: "json",
      temperature: 0.2,
      maxTokens: 1000,
    });

    const result = parseAIJSON(rawAIResponse);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Job Fit Analyze API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
