"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import dynamic from "next/dynamic";
import { StandardPDF } from "@/components/StandardPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function CoverLetterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ companyName: "", position: "", jobDescription: "" });
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.position || !formData.jobDescription) return;
    setLoading(true);
    try {
      const res = await fetch("/api/doc/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: "COVER",
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
        <h1 className="text-3xl font-display text-(--green) mb-2">Cover Letter Builder</h1>
        <p className="text-gray-600">Surat lamaran yang disesuaikan spesifik untuk deskripsi pekerjaan target.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Detail Pekerjaan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan*</label>
                <Input 
                  placeholder="Contoh: PT Bangun Bangsa"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Target*</label>
                <Input 
                  placeholder="Contoh: Data Analyst"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (Teks)*</label>
                <textarea 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-(--green) focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2 min-h-[120px] text-sm"
                  placeholder="Paste isi requirement kerjaan dari LinkedIn disini..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={loading || !formData.companyName || !formData.position || !formData.jobDescription}
              >
                {loading ? "AI Menulis Surat..." : "Generate Cover Letter"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preview Dokumen</h2>
          <Card className="h-[550px] flex flex-col border border-gray-200 bg-gray-50 p-0 overflow-hidden">
            {!generatedText ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Dokumen Anda akan tampil di sini
              </div>
            ) : (
              <textarea
                className="flex-1 w-full p-6 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-(--green) text-gray-800 leading-relaxed text-sm"
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
              />
            )}
          </Card>
          
          {generatedText && (
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={copyToClipboard}>
                Copy Teks
              </Button>
              <PDFDownloadLink
                document={<StandardPDF content={generatedText} title="Cover Letter" />}
                fileName="Cover_Letter.pdf"
              >
                {({ loading }) => (
                  <Button variant="primary" className="w-full" disabled={loading}>
                    {loading ? "Menyiapkan PDF..." : "Export PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
