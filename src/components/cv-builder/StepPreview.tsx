"use client";

import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import { type CVData, type CVMode } from "@/components/CVPDF";

const CVDownloadButton = dynamic(
  () => import("@/components/CVDownloadButton"),
  { ssr: false },
);

type Props = {
  cvData: CVData;
  mode: CVMode;
  isCreative: boolean;
  generating: boolean;
  handleGenerate: () => void;
  showRevise: boolean;
  setShowRevise: (v: boolean) => void;
  reviseInstruction: string;
  setReviseInstruction: (v: string) => void;
  revising: boolean;
  handleRevise: () => void;
};

function CVPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, education, experience, projects, skills } = data;

  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.linkedin,
    personalInfo.portfolio,
  ].filter(Boolean);

  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

  const renderBullets = (desc: string) => {
    if (!desc.trim()) return null;
    return desc
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, i) => {
        const clean =
          line.startsWith("-") || line.startsWith("•") ? line.slice(1).trim() : line;
        return <li key={i} className="cv-bullet">{clean}</li>;
      });
  };

  return (
    <div className="cv-preview-root">
      <div className="cv-header">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 8, border: "2px solid #e5e7eb" }}
          />
        )}
        <h1 className="cv-name">{personalInfo.fullName || "NAMA LENGKAP"}</h1>
        <div className="cv-header-rule" />
        {contactParts.length > 0 && <p className="cv-contact">{contactParts.join(" | ")}</p>}
      </div>

      {summary.trim() && (
        <section className="cv-section">
          <h2 className="cv-section-title">TENTANG SAYA</h2>
          <div className="cv-section-rule" />
          <p className="cv-body-text">{summary.trim()}</p>
        </section>
      )}

      {education.some((e) => e.institution.trim()) && (
        <section className="cv-section">
          <h2 className="cv-section-title">PENDIDIKAN</h2>
          <div className="cv-section-rule" />
          {education.map((edu, i) =>
            edu.institution.trim() ? (
              <div key={i} className="cv-entry">
                <div className="cv-row-space-between">
                  <span className="cv-bold">{edu.institution}</span>
                  <span className="cv-date">{[edu.startYear, edu.endYear].filter(Boolean).join(" - ")}</span>
                </div>
                {edu.degree && <p className="cv-sub-text">{edu.degree}</p>}
                {edu.gpa && <p className="cv-sub-text">IPK / GPA: {edu.gpa}</p>}
              </div>
            ) : null,
          )}
        </section>
      )}

      {experience.some((e) => e.company.trim()) && (
        <section className="cv-section">
          <h2 className="cv-section-title">PENGALAMAN</h2>
          <div className="cv-section-rule" />
          {experience.map((exp, i) =>
            exp.company.trim() ? (
              <div key={i} className="cv-entry">
                <p className="cv-company">{exp.company}</p>
                <div className="cv-row-space-between">
                  <span className="cv-role">{exp.role}</span>
                  <span className="cv-date">{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
                </div>
                {exp.description.trim() && (
                  <ul className="cv-bullet-list">{renderBullets(exp.description)}</ul>
                )}
              </div>
            ) : null,
          )}
        </section>
      )}

      {projects.some((p) => p.name.trim()) && (
        <section className="cv-section">
          <h2 className="cv-section-title">PROYEK</h2>
          <div className="cv-section-rule" />
          {projects.map((proj, i) =>
            proj.name.trim() ? (
              <div key={i} className="cv-entry">
                <div className="cv-row-space-between">
                  <span className="cv-bold">{proj.name}</span>
                  {proj.link && <span className="cv-date">{proj.link}</span>}
                </div>
                {proj.description.trim() && <p className="cv-body-text">{proj.description.trim()}</p>}
              </div>
            ) : null,
          )}
        </section>
      )}

      {skillList.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">KEAHLIAN</h2>
          <div className="cv-section-rule" />
          <p className="cv-body-text">{skillList.join("  •  ")}</p>
        </section>
      )}

      <style jsx>{`
        .cv-preview-root { font-family: "Times New Roman", Times, serif; color: #1a1a1a; font-size: 11px; line-height: 1.5; padding: 0; background: white; }
        .cv-header { text-align: center; margin-bottom: 14px; }
        .cv-name { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px; color: #111; }
        .cv-header-rule { height: 2px; background: #1a1a1a; margin: 4px 0 5px; }
        .cv-contact { font-size: 10px; color: #444; margin: 0; }
        .cv-section { margin-top: 11px; }
        .cv-section-title { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 3px; color: #111; }
        .cv-section-rule { height: 1px; background: #1a1a1a; margin-bottom: 6px; }
        .cv-entry { margin-bottom: 8px; }
        .cv-row-space-between { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .cv-bold { font-weight: 700; font-size: 10px; }
        .cv-company { font-weight: 700; font-size: 10.5px; margin: 0 0 2px; }
        .cv-role { font-weight: 700; font-size: 9.5px; color: #333; }
        .cv-date { font-size: 9.5px; color: #666; white-space: nowrap; flex-shrink: 0; }
        .cv-sub-text { font-size: 9.5px; color: #555; margin: 1px 0 0; }
        .cv-body-text { font-size: 9.5px; color: #333; margin: 2px 0 0; line-height: 1.55; }
        .cv-bullet-list { list-style: none; padding: 0; margin: 3px 0 0; }
        .cv-bullet { font-size: 9.5px; color: #333; padding-left: 12px; position: relative; margin-bottom: 1px; line-height: 1.5; }
        .cv-bullet::before { content: "•"; position: absolute; left: 0; }
      `}</style>
    </div>
  );
}

export default function StepPreview({
  cvData, mode, isCreative, generating, handleGenerate,
  showRevise, setShowRevise, reviseInstruction, setReviseInstruction,
  revising, handleRevise,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Preview & Export</h2>
      <p className="text-gray-500 text-sm mb-4">
        Berikut adalah pratinjau CV Anda. Pastikan semua data sudah benar sebelum mengunduh.
      </p>

      <div className="border border-[var(--green)] bg-[#f0fff0] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-bold text-[var(--dark-blue)] text-sm">Generate CV dengan AI</h3>
            <p className="text-xs text-gray-500 font-semibold">
              AI akan menyempurnakan summary, bullet points pengalaman, dan deskripsi project secara otomatis.
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={handleGenerate} disabled={generating} className="w-full">
          {generating ? "AI sedang membuat CV..." : `✨ Generate CV ${isCreative ? "Kreatif" : "ATS-Friendly"} dengan AI`}
        </Button>
      </div>

      <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-auto" style={{ maxHeight: "420px", padding: "32px 40px" }}>
        <CVPreview data={cvData} />
      </div>

      <div className="mt-4 border-t pt-4">
        {!showRevise ? (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setShowRevise(true)}>
              ✨ Revisi CV dengan AI
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[#777777] font-semibold">
              Beri instruksi ke AI cara memperbaiki CV-mu (mis. &quot;Buat summary lebih menarik&quot;, &quot;Tambahkan poin pencapaian di pengalaman&quot;).
            </p>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm"
              rows={3}
              value={reviseInstruction}
              onChange={(e) => setReviseInstruction(e.target.value)}
              placeholder="Tulis instruksi revisi di sini..."
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowRevise(false)} disabled={revising}>Batal</Button>
              <Button variant="primary" onClick={handleRevise} disabled={revising || !reviseInstruction.trim()}>
                {revising ? "AI merevisi..." : "Revisi Sekarang"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center mt-4 border-t pt-4 gap-3">
        <CVDownloadButton
          data={cvData}
          mode={mode}
          fileName={`${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "CV"}_${isCreative ? "Kreatif" : "ATS"}.pdf`}
        />
        <p className="text-xs text-[#AFAFAF] font-semibold">
          Klik tombol di atas untuk mengunduh PDF.
        </p>
      </div>
    </div>
  );
}
