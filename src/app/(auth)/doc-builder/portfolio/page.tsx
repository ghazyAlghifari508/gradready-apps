"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function PortfolioPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ projectName: "", techStack: "", goal: "", impact: "" });
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    if (!formData.projectName || !formData.goal) return;
    setLoading(true);
    try {
      const res = await fetch("/api/doc/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "PORTFOLIO",
          inputs: formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedText(data.doc.contentText);
      } else {
        alert("Gagal memproses AI: " + data.error);
      }
    } catch {
      alert("Error generate doc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-(--green) mb-2">Portfolio Description</h1>
        <p className="text-gray-600">Buat deksripsi project yang berdampak dengan 2 varian untuk CV dan Repositori Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Detail Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project*</label>
                <Input 
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan / Latar Belakang*</label>
                <Input 
                  placeholder="Mengapa ini dibuat?"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dampak (Impact / Hasil)*</label>
                <Input 
                  placeholder="Cth: Menghemat 10% waktu, dipakai 500 orang."
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (Opsional)</label>
                <Input 
                  placeholder="Next.js, Tailwind, Postgres..."
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={loading || !formData.projectName || !formData.goal}
              >
                {loading ? "Menganalisis Project..." : "Generate Deksripsi Project"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preview Varian</h2>
          <Card className="h-[520px] flex flex-col border border-gray-200 bg-gray-50 p-0 overflow-hidden">
            {!generatedText ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                AI akan memberikan versi Teknis & Non-Teknis.
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-6 bg-white whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {generatedText}
              </div>
            )}
          </Card>
          
          {generatedText && (
            <Button variant="primary" className="w-full" onClick={() => {
              navigator.clipboard.writeText(generatedText);
              alert("Disalin!");
            }}>
              Copy Teks
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
