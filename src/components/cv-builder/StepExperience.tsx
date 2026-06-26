"use client";

import Input from "@/components/ui/Input";
import { type CVData } from "@/components/CVPDF";

type Props = { cvData: CVData; setCvData: (d: CVData) => void };

export default function StepExperience({ cvData, setCvData }: Props) {
  const exp = cvData.experience[0];
  const set = (patch: Partial<typeof exp>) =>
    setCvData({ ...cvData, experience: [{ ...exp, ...patch }] });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Pengalaman Kerja</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Nama Perusahaan</label>
          <Input value={exp.company} onChange={(e) => set({ company: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Peran / Posisi</label>
          <Input value={exp.role} onChange={(e) => set({ role: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal Mulai (mis: Jan 2023)</label>
          <Input placeholder="Januari 2023" value={exp.startDate} onChange={(e) => set({ startDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal Selesai (mis: Jun 2024)</label>
          <Input placeholder="Juni 2024 atau Sekarang" value={exp.endDate} onChange={(e) => set({ endDate: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm mb-1">
            Deskripsi & Dampak — gunakan bullet points (satu per baris, mulai dengan -)
          </label>
          <textarea
            className="w-full border rounded p-2 min-h-[120px] text-sm"
            placeholder="- Mengembangkan fitur X yang meningkatkan efisiensi 20%&#10;- Berkolaborasi dengan tim engineering dalam sprint Agile"
            value={exp.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
