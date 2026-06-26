"use client";

import { type CVData } from "@/components/CVPDF";

type Props = { cvData: CVData; setCvData: (d: CVData) => void; isCreative: boolean };

export default function StepSkills({ cvData, setCvData, isCreative }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Keahlian (Skills)</h2>
      <div>
        <label className="block text-sm mb-1">Daftar Keahlian — pisahkan dengan koma</label>
        <textarea
          className="w-full border rounded p-2 min-h-[120px] text-sm"
          placeholder="Next.js, React, Tailwind CSS, Python, SQL, Figma, Git..."
          value={cvData.skills}
          onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
        />
      </div>

      {isCreative && (
        <>
          <div>
            <label className="block text-sm mb-1">Bahasa — pisahkan dengan koma (mis. Indonesia, English)</label>
            <textarea
              className="w-full border rounded p-2 min-h-[70px] text-sm"
              placeholder="Bahasa Indonesia (Native), English (Professional)..."
              value={cvData.languages ?? ""}
              onChange={(e) => setCvData({ ...cvData, languages: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Sertifikasi — satu per baris atau pisahkan dengan koma</label>
            <textarea
              className="w-full border rounded p-2 min-h-[70px] text-sm"
              placeholder="AWS Certified Cloud Practitioner, TOEFL ITP 600..."
              value={cvData.certifications ?? ""}
              onChange={(e) => setCvData({ ...cvData, certifications: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
