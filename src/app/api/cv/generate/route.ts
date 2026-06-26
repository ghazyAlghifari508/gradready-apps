import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertFeatureQuota, consumeCredit } from "@/lib/billing";
import { callAI, parseAndValidateAIJSON } from "@/lib/ai";
import { handleApiError, apiError } from "@/lib/errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const educationSchema = z.object({
  institution: z.string().max(200),
  degree: z.string().max(200),
  startYear: z.string().max(50),
  endYear: z.string().max(50),
  gpa: z.string().max(20),
});

const experienceSchema = z.object({
  company: z.string().max(200),
  role: z.string().max(200),
  startDate: z.string().max(50),
  endDate: z.string().max(50),
  description: z.string().max(2000),
});

const projectSchema = z.object({
  name: z.string().max(200),
  description: z.string().max(1000),
  link: z.string().max(500),
});

const cvDataSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().max(200),
    email: z.string().max(200),
    phone: z.string().max(50),
    linkedin: z.string().max(300).optional().default(""),
    portfolio: z.string().max(300).optional().default(""),
    headline: z.string().max(300).optional().default(""),
    photo: z.string().max(500).optional().default(""),
    location: z.string().max(200).optional().default(""),
  }),
  summary: z.string().max(1000),
  languages: z.string().max(500).optional().default(""),
  certifications: z.string().max(500).optional().default(""),
  education: z.array(educationSchema).max(10),
  experience: z.array(experienceSchema).max(15),
  projects: z.array(projectSchema).max(15),
  skills: z.string().max(1000),
});

const generateSchema = z.object({
  cvData: cvDataSchema,
  mode: z.enum(["ats", "creative"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = generateSchema.safeParse(await req.json().catch(() => undefined));
    if (!body.success) return apiError(400, "INVALID_PAYLOAD", body.error.issues);

    const sub = await assertFeatureQuota(session.user.id, "CV_GENERATE");
    const { cvData, mode } = body.data;
    const isCreative = mode === "creative";

    const prompt = `You are an expert professional CV/resume writer. The user has provided their raw information below. Your job is to generate a polished, professional CV.

${isCreative ? "This is a CREATIVE CV — you may add a compelling professional headline and enrich the language to be more dynamic and personality-driven." : "This is an ATS-FRIENDLY CV — use clean, straightforward language optimized for Applicant Tracking Systems. Avoid creative embellishments. Focus on keywords and quantifiable achievements."}

RULES:
1. Improve the summary to be more impactful and professional (3-5 sentences).
2. Rewrite experience descriptions into strong bullet points starting with action verbs. Add quantifiable results where possible. Each bullet on a new line starting with "- ".
3. Improve project descriptions to be concise and highlight impact.
4. Keep all factual data (names, dates, institutions, companies, roles) EXACTLY as provided — do NOT invent or change facts.
5. Keep the skills list as-is unless you can naturally group or improve phrasing.
6. Return ONLY valid JSON matching the exact schema below.

User's raw CV data:
${JSON.stringify(cvData, null, 2)}

Return a JSON object with this EXACT schema:
{
  "personalInfo": { "fullName": string, "email": string, "phone": string, "linkedin": string, "portfolio": string, "headline": string, "photo": string, "location": string },
  "summary": string,
  "languages": string,
  "certifications": string,
  "education": [{ "institution": string, "degree": string, "startYear": string, "endYear": string, "gpa": string }],
  "experience": [{ "company": string, "role": string, "startDate": string, "endDate": string, "description": string }],
  "projects": [{ "name": string, "description": string, "link": string }],
  "skills": string
}`;

    const raw = await callAI(prompt, {
      systemPrompt: isCreative
        ? "You are a creative CV writer. Return valid JSON only, same schema as input. Make the language dynamic and compelling while keeping facts accurate."
        : "You are an ATS-optimized CV writer. Return valid JSON only, same schema as input. Use clean, keyword-rich language suitable for automated screening systems.",
      format: "json",
      maxTokens: 3000,
      temperature: 0.4,
    });

    const generated = parseAndValidateAIJSON(raw, cvDataSchema);
    await consumeCredit(session.user.id, "CV_GENERATE", sub);

    return NextResponse.json({ generated });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
