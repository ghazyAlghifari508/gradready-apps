"use client";

import { type CVData } from "@/components/CVPDF";

type Props = { cvData: CVData; setCvData: (d: CVData) => void };

export default function StepSummary({ cvData, setCvData }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
      <div>
        <label className="block text-sm mb-1">
          Ringkasan Karir — deskripsikan diri Anda secara singkat dan impactful (3–5 kalimat)
        </label>
        <textarea
          className="w-full border rounded p-2 min-h-[150px] text-sm"
          placeholder="Contoh: Mahasiswa Sistem Informasi dengan pengalaman internship di bidang pengembangan web..."
          value={cvData.summary}
          onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
        />
      </div>
    </div>
  );
}
