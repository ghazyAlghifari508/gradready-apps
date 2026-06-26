"use client";

import Input from "@/components/ui/Input";
import { type CVData } from "@/components/CVPDF";

type Props = { cvData: CVData; setCvData: (d: CVData) => void };

export default function StepEducation({ cvData, setCvData }: Props) {
  const edu = cvData.education[0];
  const set = (patch: Partial<typeof edu>) =>
    setCvData({ ...cvData, education: [{ ...edu, ...patch }] });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Pendidikan Terakhir</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm mb-1">Institusi / Universitas</label>
          <Input value={edu.institution} onChange={(e) => set({ institution: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Gelar / Jurusan</label>
          <Input value={edu.degree} onChange={(e) => set({ degree: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">GPA / IPK</label>
          <Input value={edu.gpa} onChange={(e) => set({ gpa: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Tahun Masuk</label>
          <Input placeholder="2022" value={edu.startYear} onChange={(e) => set({ startYear: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Tahun Lulus / Sekarang</label>
          <Input placeholder="2026 atau Sekarang" value={edu.endYear} onChange={(e) => set({ endYear: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
