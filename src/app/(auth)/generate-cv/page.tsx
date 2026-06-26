"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { type CVData, type CVMode } from "@/components/CVPDF";

const CVDownloadButton = dynamic(
  () => import("@/components/CVDownloadButton"),
  { ssr: false },
);

type FormState = { fullName: string; email: string; phone: string; linkedin: string; position: string; education: string; skills: string };

export default function GenerateCVPage() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<CVMode>("ats");
  const [loading, setLoading] = useState(false);
  const [generatedCv, setGeneratedCv] = useState<CVData | null>(null);
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", phone: "", linkedin: "", position: "", education: "", skills: "" });

  const handleGenerate = useCallback(async () => {
    if (!form.fullName || !form.email || !form.position) {
      showToast("Nama, email, dan posisi wajib diisi!", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData: {
            personalInfo: { fullName: form.fullName, email: form.email, phone: form.phone, linkedin: form.linkedin, portfolio: "", headline: "", photo: "", location: "" },
            summary: "",
            languages: "",
            certifications: "",
            education: form.education ? [{ institution: form.education, degree: "", startYear: "", endYear: "", gpa: "" }] : [],
            experience: [],
            projects: [],
            skills: form.skills,
          },
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Gagal generate CV.");
      setGeneratedCv(data.generated as CVData);
      showToast("CV berhasil di-generate!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal generate CV.", "error");
    } finally {
      setLoading(false);
    }
  }, [form, mode, showToast]);

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-6">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">Generate CV dengan AI</h1>
        <p className="text-[#777777] font-semibold">Isi data dasar, AI akan membuat CV ATS-Friendly atau Kreatif untuk Anda.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-8">
        {[{ key: "ats" as CVMode, title: "CV ATS-Friendly" }, { key: "creative" as CVMode, title: "CV Kreatif" }].map((opt) => (
          <button key={opt.key} type="button" onClick={() => setMode(opt.key)}
            className={`text-left rounded-2xl p-4 border-2 transition-colors flex-1 min-w-[200px] ${mode === opt.key ? "border-(--green) bg-green-50" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-4 h-4 rounded-full border-2 ${mode === opt.key ? "border-(--green) bg-(--green)" : "border-gray-300"}`} />
              <span className="font-bold text-[15px] text-[var(--dark-blue)]">{opt.title}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Data Diri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
              <Input placeholder="John Doe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input type="email" placeholder="john@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <Input placeholder="08123456789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <Input placeholder="linkedin.com/in/johndoe" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Target *</label>
              <Input placeholder="Frontend Developer" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
              <Input placeholder="Universitas Gadjah Mada - Ilmu Komputer" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (pisahkan koma)</label>
              <textarea className="w-full border rounded p-2 text-sm min-h-[80px]" placeholder="Next.js, React, TypeScript, Python"
                value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? "AI Sedang Membuat CV..." : "✨ Generate CV dengan AI"}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preview CV</h2>
          <Card className="border border-gray-200 bg-gray-50 p-0 overflow-hidden min-h-[400px]">
            {!generatedCv ? (
              <div className="flex items-center justify-center h-[400px] text-gray-400">CV hasil generate akan tampil di sini</div>
            ) : (
              <div className="p-6 bg-white overflow-auto max-h-[500px] text-sm whitespace-pre-wrap font-mono">
                {JSON.stringify(generatedCv, null, 2)}
              </div>
            )}
          </Card>
          {generatedCv && (
            <CVDownloadButton
              data={generatedCv}
              mode={mode}
              fileName={`${generatedCv.personalInfo.fullName.replace(/\s+/g, "_")}_CV_${mode === "creative" ? "Kreatif" : "ATS"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
