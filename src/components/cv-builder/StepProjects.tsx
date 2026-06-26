"use client";

import Input from "@/components/ui/Input";
import { type CVData } from "@/components/CVPDF";

type Props = { cvData: CVData; setCvData: (d: CVData) => void };

export default function StepProjects({ cvData, setCvData }: Props) {
  const proj = cvData.projects[0];
  const set = (patch: Partial<typeof proj>) =>
    setCvData({ ...cvData, projects: [{ ...proj, ...patch }] });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Project</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Nama Project</label>
          <Input value={proj.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Link (Opsional)</label>
          <Input placeholder="github.com/username/repo" value={proj.link} onChange={(e) => set({ link: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm mb-1">Deskripsi Project</label>
          <textarea
            className="w-full border rounded p-2 min-h-[100px] text-sm"
            placeholder="Jelaskan tujuan, teknologi yang digunakan, dan hasil/dampaknya..."
            value={proj.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
