"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search, Zap, Check, X } from "lucide-react";

type JobFitResult = {
  fitScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string;
};

export default function JobFitPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobFitResult | null>(null);

  const handleAnalyze = async () => {
    if (jobDescription.length < 50) {
      alert("Job Description terlalu pendek. Mohon masukkan lebih banyak detail.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/jobfit/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze");
      }
      setResult(data.result);
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-6">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">Job Fit Estimator</h1>
        <p className="text-[#777777] font-semibold">Ukur seberapa cocok profil dan skillmu dengan Job Description incaranmu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 flex flex-col justify-between h-[600px] border-[#E5E5E5]">
          <div className="flex flex-col h-full">
            <h3 className="text-[#4B4B4B] text-[18px] font-bold mb-4">Tempel Job Description</h3>
            <textarea
              className="flex-1 w-full bg-[#F5F5F5] border-2 border-[#E5E5E5] rounded-[16px] p-4 text-[#4B4B4B] font-medium text-[15px] focus:outline-none focus:border-[#1CB0F6] focus:bg-white resize-none"
              placeholder="Paste deskripsi lowongan kerja di sini... (Requirement, kualifikasi, tanggung jawab)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <Button
              className="w-full"
              variant="primary"
              onClick={handleAnalyze}
              disabled={loading || !jobDescription}
            >
              {loading ? "Menganalisis..." : "Cek Job Fit"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 h-[600px] overflow-y-auto border-t-4 border-[#1CB0F6]">
          {!result && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#AFAFAF] px-6">
              <div className="w-[100px] h-[100px] bg-[#F5F5F5] rounded-[24px] flex items-center justify-center mb-6">
                 <Search size={48} />
              </div>
              <p className="font-bold text-[18px]">Belum ada hasil</p>
              <p className="font-medium text-[15px]">Masukkan Job Description di sebelah kiri dan klik tombol untuk memulai estimasi AI.</p>
            </div>
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#1CB0F6] px-6">
              <div className="w-[100px] h-[100px] bg-[rgba(28,176,246,0.1)] rounded-[24px] flex items-center justify-center mb-6 animate-pulse">
                <Zap size={48} />
              </div>
              <p className="font-bold text-[18px]">AI sedang menganalisis...</p>
              <p className="font-medium text-[15px] text-[#AFAFAF]">Membandingkan resume terakhirmu dengan requirement loker.</p>
            </div>
          ) : result && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                 <div className="font-['Fredoka_One'] text-[64px] leading-none mb-2" style={{ color: result.fitScore >= 75 ? "#58CC02" : result.fitScore >= 50 ? "#FF9600" : "#FF4B4B" }}>
                   {result.fitScore}%
                 </div>
                 <div className="font-bold text-[16px] text-[#777777] uppercase tracking-[1px]">Match Score</div>
              </div>

              <div>
                <h4 className="font-bold text-[16px] text-[#4B4B4B] mb-3 flex items-center gap-2">
                    <Check size={18} strokeWidth={3} className="text-[#58CC02]" /> Matching Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.matchingSkills?.length > 0 ? result.matchingSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-[rgba(88,204,2,0.1)] text-[#58CC02] text-[13px] font-bold rounded-xl border border-[rgba(88,204,2,0.2)]">
                      {s}
                    </span>
                  )) : (
                    <span className="text-[#AFAFAF] text-[13px] font-semibold italic">Tidak ada matching skill signifikan</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[16px] text-[#4B4B4B] mb-3 flex items-center gap-2">
                    <X size={18} strokeWidth={3} className="text-[#FF4B4B]" /> Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? result.missingSkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-[rgba(255,75,75,0.1)] text-[#FF4B4B] text-[13px] font-bold rounded-xl border border-[rgba(255,75,75,0.2)]">
                      {s}
                    </span>
                  )) : (
                    <span className="text-[#AFAFAF] text-[13px] font-semibold italic">Kamu memenuhi hampir semua rekursi skill!</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#F5F5F5] border-2 border-[#E5E5E5] rounded-2xl">
                <h4 className="font-bold text-[15px] text-[#4B4B4B] mb-2 uppercase tracking-[0.5px]">Rekomendasi AI</h4>
                <p className="text-[#777777] text-[14px] font-medium leading-[1.6]">
                  {result.recommendations || "Tidak ada rekomendasi spesifik."}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
