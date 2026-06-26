export interface CVSections {
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasContact: boolean;
  hasCertification: boolean;
}

export interface CVScoreBreakdown {
  format: number; // 0-20
  atsKeywords: number; // 0-25
  completeness: number; // 0-30
  language: number; // 0-25
  total: number; // 0-100
}

export interface CVAnalysisResult {
  score: CVScoreBreakdown;
  parsedSkills: string[];
  sections: CVSections;
  feedbackJson: Record<
    string,
    { status: "good" | "warning" | "error"; message: string }
  >;
  languageQuality: "good" | "fair" | "poor";
}

const ATS_KEYWORDS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "react",
  "node",
  "sql",
  "git",
  "html",
  "css",
  "api",
  "database",
  "agile",
  "scrum",
  "docker",
  "aws",
  "machine learning",
  "data analysis",
  "figma",
  "flutter",
  "kotlin",
  "swift",
  "developed",
  "implemented",
  "designed",
  "managed",
  "led",
  "created",
  "built",
  "optimized",
  "improved",
  "delivered",
  "collaborated",
  "achieved",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "summary",
  "objective",
  "contact",
  "portfolio",
  "linkedin",
  "github",
];

export function scoreCv(params: {
  text: string;
  sections: CVSections;
  skills: string[];
  languageQuality: "good" | "fair" | "poor";
}): CVScoreBreakdown {
  const { text, sections, skills: _skills, languageQuality } = params;
  const lowerText = text.toLowerCase();

  let format = 0;
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 200) format += 5;
  if (wordCount <= 1000) format += 5;
  if (sections.hasSummary) format += 5;
  const bulletCount = (text.match(/[•\-\*▪▸◦]/g) ?? []).length;
  if (bulletCount >= 5) format += 5;

  const matchedKeywords = ATS_KEYWORDS.filter((kw) => lowerText.includes(kw));
  const keywordRatio = matchedKeywords.length / ATS_KEYWORDS.length;
  const atsKeywords = Math.min(25, Math.round(keywordRatio * 50));

  let completeness = 0;
  if (sections.hasSummary) completeness += 5;
  if (sections.hasExperience) completeness += 8;
  if (sections.hasEducation) completeness += 7;
  if (sections.hasSkills) completeness += 6;
  if (sections.hasContact) completeness += 4;

  const languageScore: Record<string, number> = {
    good: 25,
    fair: 15,
    poor: 5,
  };
  const language = languageScore[languageQuality] ?? 5;

  const total = format + atsKeywords + completeness + language;

  return {
    format,
    atsKeywords,
    completeness,
    language,
    total: Math.min(100, total),
  };
}

export function generateFeedback(
  sections: CVSections,
  score: CVScoreBreakdown,
  skillCount: number,
): Record<string, { status: "good" | "warning" | "error"; message: string }> {
  return {
    summary: sections.hasSummary
      ? {
          status: "good",
          message:
            "Ringkasan profil ditemukan. Pastikan menjelaskan value proposition kamu dalam 2–3 kalimat.",
        }
      : {
          status: "error",
          message:
            "Tidak ada ringkasan profil. Tambahkan Summary/Objective di awal CV untuk meningkatkan skor ATS.",
        },

    experience: sections.hasExperience
      ? {
          status: "good",
          message:
            "Bagian pengalaman kerja terdeteksi. Gunakan kata kerja aktif (Developed, Led, Built) untuk setiap poin.",
        }
      : {
          status: "warning",
          message:
            "Bagian pengalaman tidak terdeteksi. Tambahkan internship, proyek, atau organisasi jika belum ada pengalaman kerja.",
        },

    education: sections.hasEducation
      ? {
          status: "good",
          message:
            "Pendidikan terdeteksi. Pastikan mencantumkan GPA jika ≥ 3.0.",
        }
      : {
          status: "error",
          message:
            "Informasi pendidikan tidak ditemukan. Wajib ada untuk fresh graduate.",
        },

    skills:
      skillCount >= 5
        ? {
            status: "good",
            message: `${skillCount} skill teknis terdeteksi. Pastikan skill relevan dengan posisi yang dilamar.`,
          }
        : {
            status: "warning",
            message: `Hanya ${skillCount} skill terdeteksi. Tambahkan lebih banyak skill teknis yang relevan.`,
          },

    contact: sections.hasContact
      ? {
          status: "good",
          message:
            "Informasi kontak lengkap. Pastikan email profesional dan nomor HP aktif.",
        }
      : {
          status: "error",
          message:
            "Informasi kontak tidak ditemukan atau tidak lengkap. Tambahkan email, nomor HP, dan LinkedIn.",
        },

    format:
      score.format >= 15
        ? {
            status: "good",
            message:
              "Format CV rapi — panjang tepat dan menggunakan bullet points.",
          }
        : score.format >= 8
          ? {
              status: "warning",
              message:
                "Format bisa ditingkatkan — gunakan lebih banyak bullet points dan pastikan panjang CV 1–2 halaman.",
            }
          : {
              status: "error",
              message:
                "Format CV perlu perbaikan besar — terlalu singkat atau terlalu panjang. Target 1 halaman untuk fresh graduate.",
            },

    ats:
      score.atsKeywords >= 18
        ? {
            status: "good",
            message: "CV ramah ATS — banyak keyword relevan ditemukan.",
          }
        : score.atsKeywords >= 10
          ? {
              status: "warning",
              message:
                "Beberapa keyword ATS ditemukan. Tambahkan lebih banyak keyword dari job description yang ditarget.",
            }
          : {
              status: "error",
              message:
                "CV kurang keyword ATS. Tambahkan skill teknis spesifik (nama framework, tools, bahasa pemrograman).",
            },
  };
}
