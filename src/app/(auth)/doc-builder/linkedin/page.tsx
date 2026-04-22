"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LinkedInPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ industry: "", tone: "professional", highlights: "" });
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    if (!formData.industry) return;
    setLoading(true);
    try {
      const res = await fetch("/api/doc/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "LINKEDIN",
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    alert("Berhasil disalin ke clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-(--green) mb-2">LinkedIn About Generator</h1>
        <p className="text-gray-600">Buat Summary LinkedIn yang mengesankan perekrut.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Preferensi Generasi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industri Target*</label>
                <Input 
                  placeholder="Contoh: Digital Marketing, Tech, dll"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone (Gaya Bahasa)*</label>
                <select 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-(--green) focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option value="professional">Profesional & Formal</option>
                  <option value="creative">Kreatif & Energik</option>
                  <option value="storytelling">Storytelling (Bercerita)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Highlights (Opsional)</label>
                <textarea 
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm min-h-[80px]"
                  placeholder="Prestasi atau project yang wajib disebut..."
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={loading || !formData.industry}
              >
                {loading ? "AI Mengarang Summary..." : "Generate Summary"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex justify-between">
            <span>Preview Teks</span>
            {generatedText && (
               <span className={`text-sm ${generatedText.length > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
                 {generatedText.length} / 2000 karakter
               </span>
            )}
          </h2>
          <Card className="h-[400px] flex flex-col border border-gray-200 bg-gray-50 p-0 overflow-hidden">
            {!generatedText ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Summary akan tampil di sini
              </div>
            ) : (
              <textarea
                className="flex-1 w-full p-6 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-(--green) text-gray-800 text-sm"
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
              />
            )}
          </Card>
          
          {generatedText && (
            <Button variant="primary" className="w-full" onClick={copyToClipboard}>
              Copy Teks
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
