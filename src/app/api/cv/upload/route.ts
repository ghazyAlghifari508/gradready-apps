import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { extractTextFromPDF } from "@/lib/pdf";
import { callAI, parseAndValidateAIJSON } from "@/lib/ai";
import { assertAiQuota, consumeCredit } from "@/lib/billing";
import { handleApiError } from "@/lib/errors";
import { scoreCv, generateFeedback, CVSections } from "@/lib/cv-scorer";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const CV_TEXT_ANALYSIS_CHAR_CAP = 4000;
const UPLOAD_RATE_LIMIT = 10;
const UPLOAD_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

async function isUploadRateLimited(userId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - UPLOAD_RATE_LIMIT_WINDOW);
  const count = await prisma.cvRecord.count({
    where: { userId, createdAt: { gte: cutoff } },
  });
  return count >= UPLOAD_RATE_LIMIT;
}

const cvSectionsSchema = z
  .object({
    hasSummary: z.boolean(),
    hasExperience: z.boolean(),
    hasEducation: z.boolean(),
    hasSkills: z.boolean(),
    hasContact: z.boolean(),
    hasCertification: z.boolean(),
  })
  .strict();

const cvParseSchema = z
  .object({
    skills: z.array(z.string()),
    sections: cvSectionsSchema,
    languageQuality: z.enum(["good", "fair", "poor"]),
    name: z.string().optional(),
  })
  .strict();

const CV_PARSE_PROMPT = (cvText: string) => `
Analisis CV berikut dan kembalikan HANYA JSON (tanpa teks lain) dengan format ini:
{
  "skills": ["skill1", "skill2", ...],
  "sections": {
    "hasSummary": true/false,
    "hasExperience": true/false,
    "hasEducation": true/false,
    "hasSkills": true/false,
    "hasContact": true/false,
    "hasCertification": true/false
  },
  "languageQuality": "good" | "fair" | "poor",
  "name": "nama kandidat atau empty string"
}

Petunjuk:
- skills: daftar SEMUA skill teknis dan tools yang disebutkan (React, Python, Figma, dll.)
- hasSummary: true jika ada paragraf ringkasan/objective di awal
- hasExperience: true jika ada section pengalaman kerja/magang/proyek
- hasEducation: true jika ada info universitas/sekolah
- hasSkills: true jika ada section daftar skills
- hasContact: true jika ada email atau nomor HP
- languageQuality: "good" jika menggunakan action verbs & kalimat jelas, "fair" jika campuran, "poor" jika kalimat tidak jelas/typo banyak

Teks CV:
${cvText.slice(0, CV_TEXT_ANALYSIS_CHAR_CAP)}
`;

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSubscription = await assertAiQuota(
      session.user.id,
      "CV_ANALYZE",
    );

    if (await isUploadRateLimited(session.user.id)) {
      return NextResponse.json(
        { error: "Terlalu banyak upload. Silakan coba lagi nanti." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Hanya file PDF yang diterima" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (
      buffer[0] !== 0x25 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x44 ||
      buffer[3] !== 0x46
    ) {
      return NextResponse.json(
        { error: "Hanya file PDF yang diterima" },
        { status: 400 },
      );
    }

    let cvText: string;

    try {
      cvText = await extractTextFromPDF(buffer);
    } catch {
      return NextResponse.json(
        { error: "Gagal membaca PDF. Pastikan file PDF tidak terenkripsi." },
        { status: 422 },
      );
    }

    console.log(
      `[CV Upload] Extracted ${cvText.length} characters from PDF "${file.name}"`,
    );

    if (cvText.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "PDF tidak mengandung teks yang cukup. Jika Anda menggunakan Canva, pastikan opsi 'Flatten PDF' TIDAK dicentang saat download dan pilih format 'PDF Standard'.",
        },
        { status: 422 },
      );
    }

    let parsedSkills: string[] = [];
    let sections: CVSections = {
      hasSummary: false,
      hasExperience: false,
      hasEducation: false,
      hasSkills: false,
      hasContact: false,
      hasCertification: false,
    };
    let languageQuality: "good" | "fair" | "poor" = "fair";
    let aiCallSucceeded = false;

    try {
      const aiRaw = await callAI(CV_PARSE_PROMPT(cvText));
      const aiResult = parseAndValidateAIJSON(aiRaw, cvParseSchema);

      parsedSkills = aiResult.skills ?? [];
      sections = aiResult.sections ?? sections;
      languageQuality = aiResult.languageQuality ?? "fair";
      aiCallSucceeded = true;
    } catch (aiError) {
      console.error("AI analysis failed, using fallback scoring:", aiError);
      const fallbackText = cvText.slice(0, CV_TEXT_ANALYSIS_CHAR_CAP);
      const lowerText = fallbackText.toLowerCase();
      sections = {
        hasSummary: /summary|objective|profil/i.test(fallbackText),
        hasExperience: /experience|pengalaman|internship|magang|kerja/i.test(
          fallbackText,
        ),
        hasEducation: /education|pendidikan|universitas|university|s1|s2/i.test(
          fallbackText,
        ),
        hasSkills: /skills|skill|kemampuan|keahlian/i.test(fallbackText),
        hasContact: /@|email|phone|telp|hp\b/i.test(fallbackText),
        hasCertification:
          /certification|sertifikat|certificate/i.test(fallbackText),
      };
      const techKeywords = [
        "javascript",
        "python",
        "react",
        "node",
        "sql",
        "java",
        "typescript",
        "flutter",
        "figma",
        "git",
      ];
      parsedSkills = techKeywords.filter((k) => lowerText.includes(k));
    }

    const scoreBreakdown = scoreCv({
      text: cvText,
      sections,
      skills: parsedSkills,
      languageQuality,
    });

    const feedbackJson = generateFeedback(
      sections,
      scoreBreakdown,
      parsedSkills.length,
    );

    const latestCv = await prisma.cvRecord.findFirst({
      where: { userId: session.user.id },
      orderBy: { versionNumber: "desc" },
    });
    const nextVersion = (latestCv?.versionNumber ?? 0) + 1;
    const cvRecordId = randomUUID();

    let cvRecord;
    try {
      const [, , createdCvRecord] = await prisma.$transaction([
        prisma.cvRecord.findFirst({
          where: { userId: session.user.id },
          orderBy: { versionNumber: "desc" },
        }),
        prisma.cvRecord.updateMany({
          where: { userId: session.user.id, isLatest: true },
          data: { isLatest: false },
        }),
        prisma.cvRecord.create({
          data: {
            id: cvRecordId,
            userId: session.user.id,
            versionNumber: nextVersion,
            score: scoreBreakdown.total,
            parsedSkills: parsedSkills,
            feedbackJson: feedbackJson as object,
            isLatest: true,
          },
        }),
        prisma.cvScoreHistory.create({
          data: {
            userId: session.user.id,
            cvRecordId,
            score: scoreBreakdown.total,
          },
        }),
      ]);

      cvRecord = createdCvRecord;
      if (aiCallSucceeded) {
        await consumeCredit(session.user.id, "CV_ANALYZE", activeSubscription);
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Concurrent upload, please retry" },
          { status: 409 },
        );
      }

      throw error;
    }

    return NextResponse.json({
      cvRecordId: cvRecord.id,
      score: scoreBreakdown,
      parsedSkills,
      sections,
      feedbackJson,
      versionNumber: nextVersion,
    });
  } catch (error) {
    console.error("CV upload error:", error);
    return handleApiError(error);
  }
}
