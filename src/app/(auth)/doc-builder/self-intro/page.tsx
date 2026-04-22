"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SelfIntroPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ position: "", highlights: "" });
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    if (!formData.position) return;
    setLoading(true);
    try {
      const res = await fetch("/api/doc/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "SELF_INTRO",
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
        <h1 className="text-3xl font-display text-(--green) mb-2">Self-Intro Script</h1>
        <p className="text-gray-600">Script latihan 60-detik perkenalan diri (pitch) untuk interview atau networking.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Konteks Perkenalan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Target Interview*</label>
                <Input 
                  placeholder="Cth: Frontend Engineer atau Management Trainee"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Utama (Opsional)</label>
                <textarea 
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm min-h-[100px]"
                  placeholder="Hal terpenting yang wajib ditekankan, misalnya sertifikasi atau kemenangan lomba."
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-500 italic">
                *Data nama, lulusan, dan base skills akan langsung diambil dari profil platform.
              </p>
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={loading || !formData.position}
              >
                {loading ? "Menyusun Naskah..." : "Generate Intro Script"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preview Script Tersedia</h2>
          <Card className="h-[450px] flex flex-col border border-gray-200 bg-gray-50 p-0 overflow-hidden">
            {!generatedText ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Script Formal & Kasual 60-detik akan tampil di sini
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
              alert("Script Disalin!");
            }}>
              Copy Script
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
