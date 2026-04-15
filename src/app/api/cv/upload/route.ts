// app/api/cv/upload/route.ts — POST /api/cv/upload
// Accepts PDF FormData, extracts text, scores via AI, stores to DB

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf";
import { callAI, parseAIJSON } from "@/lib/ai";
import { scoreCv, generateFeedback, CVSections } from "@/lib/cv-scorer";
import { headers } from "next/headers";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
${cvText.slice(0, 4000)}
`;

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json({ error: "Hanya file PDF yang diterima" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let cvText: string;

    try {
      cvText = await extractTextFromPDF(buffer);
    } catch {
      return NextResponse.json(
        { error: "Gagal membaca PDF. Pastikan file PDF tidak terenkripsi." },
        { status: 422 }
      );
    }

    // Log extracted text length for debugging
    console.log(`[CV Upload] Extracted ${cvText.length} characters from PDF "${file.name}"`);

    if (cvText.trim().length < 20) {
      return NextResponse.json(
        { 
          error: "PDF tidak mengandung teks yang cukup. Jika Anda menggunakan Canva, pastikan opsi 'Flatten PDF' TIDAK dicentang saat download dan pilih format 'PDF Standard'." 
        },
        { status: 422 }
      );
    }

    // AI Analysis
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

    try {
      const aiRaw = await callAI(CV_PARSE_PROMPT(cvText));
      const aiResult = parseAIJSON<{
        skills: string[];
        sections: CVSections;
        languageQuality: "good" | "fair" | "poor";
        name?: string;
      }>(aiRaw);

      parsedSkills = aiResult.skills ?? [];
      sections = aiResult.sections ?? sections;
      languageQuality = aiResult.languageQuality ?? "fair";
    } catch (aiError) {
      console.error("AI analysis failed, using fallback scoring:", aiError);
      // Fallback: basic keyword detection without AI
      const lowerText = cvText.toLowerCase();
      sections = {
        hasSummary: /summary|objective|profil/i.test(cvText),
        hasExperience: /experience|pengalaman|internship|magang|kerja/i.test(cvText),
        hasEducation: /education|pendidikan|universitas|university|s1|s2/i.test(cvText),
        hasSkills: /skills|skill|kemampuan|keahlian/i.test(cvText),
        hasContact: /@|email|phone|telp|hp\b/i.test(cvText),
        hasCertification: /certification|sertifikat|certificate/i.test(cvText),
      };
      // Basic skill extraction
      const techKeywords = ["javascript", "python", "react", "node", "sql", "java", "typescript", "flutter", "figma", "git"];
      parsedSkills = techKeywords.filter((k) => lowerText.includes(k));
    }

    // Calculate score
    const scoreBreakdown = scoreCv({
      text: cvText,
      sections,
      skills: parsedSkills,
      languageQuality,
    });

    const feedbackJson = generateFeedback(sections, scoreBreakdown, parsedSkills.length);

    // Get version number
    const latestCv = await prisma.cvRecord.findFirst({
      where: { userId: session.user.id },
      orderBy: { versionNumber: "desc" },
    });
    const nextVersion = (latestCv?.versionNumber ?? 0) + 1;

    // Mark all previous CVs as not latest
    await prisma.cvRecord.updateMany({
      where: { userId: session.user.id, isLatest: true },
      data: { isLatest: false },
    });

    // Save CV record
    const cvRecord = await prisma.cvRecord.create({
      data: {
        userId: session.user.id,
        versionNumber: nextVersion,
        score: scoreBreakdown.total,
        parsedSkills: parsedSkills,
        feedbackJson: feedbackJson as object,
        isLatest: true,
      },
    });

    // Save score history
    await prisma.cvScoreHistory.create({
      data: {
        userId: session.user.id,
        cvRecordId: cvRecord.id,
        score: scoreBreakdown.total,
      },
    });

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
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
