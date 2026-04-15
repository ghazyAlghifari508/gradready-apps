import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DocType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { callAI } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { docType, inputs } = await req.json();

    if (!docType || !Object.values(DocType).includes(docType)) {
      return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
    }

    // Fetch user profile + latest CV
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      include: { targetJob: true },
    });

    const latestCv = await prisma.cvRecord.findFirst({
      where: { userId: session.user.id, isLatest: true },
    });

    const userName = session.user.name;
    const targetJob = profile?.targetJob?.name || "Professional";
    const university = profile?.university || "";
    const skills = latestCv?.parsedSkills ? (latestCv.parsedSkills as string[]).join(", ") : "Various skills";

    let contextText = `My name is ${userName}. I am applying for positions related to ${targetJob}. `;
    if (university) contextText += `I graduated from ${university}. `;
    contextText += `My key skills are: ${skills}. `;

    let systemPrompt = "You are an expert career counselor and professional writer.";
    let promptObject = "";

    switch (docType) {
      case DocType.MOTIVATION:
        systemPrompt += " Write a formal motivation letter (3-4 paragraphs) in Indonesian.";
        promptObject = `Write a motivation letter for the position of ${inputs.position} at ${inputs.companyName}. 
                        Use my profile context to highlight why I am a good fit. 
                        Do not include placeholder brackets like [Your Name], use the actual data provided.
                        Context: ${contextText}`;
        break;
      case DocType.COVER:
        systemPrompt += " Write a formal cover letter in Indonesian.";
        promptObject = `Write a 1-page cover letter for the position of ${inputs.position} at ${inputs.companyName}.
                        Here is the Job Description: "${inputs.jobDescription}".
                        Match my skills to the job description. Do not use generic placeholders.
                        Context: ${contextText}`;
        break;
      case DocType.LINKEDIN:
        systemPrompt += " Write an engaging LinkedIn About summary.";
        promptObject = `Write a LinkedIn summary (max 2000 characters) for me in a ${inputs.tone || 'professional'} tone. 
                        Target industry: ${inputs.industry}. Highlight: ${inputs.highlights || 'my skills'}.
                        Context: ${contextText}`;
        break;
      case DocType.PORTFOLIO:
        systemPrompt += " Write an impactful portfolio project description.";
        promptObject = `Write a project description for "${inputs.projectName}". 
                        Tech stack: ${inputs.techStack}. Goal: ${inputs.goal}. Impact: ${inputs.impact}.
                        Provide 2 labeled versions: 
                        1) TECHNICAL (focus on implementation, GitHub style)
                        2) NON-TECHNICAL (focus on business impact, LinkedIn style).`;
        break;
      case DocType.SELF_INTRO:
        systemPrompt += " Write a 60-90 seconds self-introduction script to use in interviews/networking.";
        promptObject = `Write a self-introduction script for ${inputs.position}. Highlights: ${inputs.highlights}.
                        Provide 2 labeled versions:
                        1) FORMAL (for traditional job interviews)
                        2) CASUAL (for career fairs / networking).
                        Context: ${contextText}`;
        break;
      default:
        return NextResponse.json({ error: "Unsupported docType yet." }, { status: 400 });
    }

    const generatedText = await callAI(promptObject, {
      systemPrompt,
      format: "text",
      maxTokens: 2500,
      temperature: 0.7,
    });

    const doc = await prisma.generatedDoc.create({
      data: {
        userId: session.user.id,
        docType: docType as DocType,
        contentText: generatedText,
        inputJson: inputs,
      },
    });

    return NextResponse.json({ success: true, doc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Doc Generate API Error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
