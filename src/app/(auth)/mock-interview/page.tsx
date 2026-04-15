"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const QUESTIONS = [
  "Ceritakan tentang dirimu dan mengapa kamu tertarik dengan karir ini?",
  "Ceritakan pengalaman ketika kamu menghadapi tantangan besar dan bagaimana cara kamu menyelesaikannya.",
  "Apa pencapaian terbesarmu sejauh ini (akademik maupun non-akademik)?",
  "Ceritakan saat kamu harus bekerja dengan anggota tim yang sulit.",
  "Di mana kamu melihat dirimu 5 tahun dari sekarang?",
];

type EvaluationResult = {
  score: number;
  feedback: string;
  improvedAnswer: string;
};

export default function MockInterviewPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (answer.trim().length < 20) {
      alert("Jawabanmu terlalu pendek. Cobalah elaborasi lebih detail.");
      return;
    }

    setLoading(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/mock-interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: selectedQuestion, answer: answer.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEvaluation(data.evaluation);
    } catch (err: any) {
      alert("Gagal mengevaluasi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#58CC02";
    if (score >= 6) return "#FF9600";
    return "#FF4B4B";
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-6">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">Mock Interview</h1>
        <p className="text-[#777777] font-semibold">Latih kemampuan wawancaramu dengan AI HRD.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Questions */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <h3 className="text-[#AFAFAF] text-[13px] font-bold uppercase tracking-[1px] mb-2">Pilih Pertanyaan</h3>
          {QUESTIONS.map((q, idx) => (
            <div 
              key={idx}
              className="cursor-pointer transition-all"
              onClick={() => {
                setSelectedQuestion(q);
                setEvaluation(null);
                setAnswer("");
              }}
            >
              <Card className={`p-4 ${selectedQuestion === q ? "border-[#1CB0F6] bg-[rgba(28,176,246,0.05)]" : "border-[#E5E5E5]"}`}>
                <p className={`text-[14px] font-bold ${selectedQuestion === q ? "text-[#1CB0F6]" : "text-[#777777]"}`}>
                  {q}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* Right Col: Answer & Eval */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6 border-[#E5E5E5] flex flex-col gap-4">
            <h3 className="text-[#4B4B4B] text-[18px] font-bold border-l-4 border-[#FF9600] pl-3">
              "{selectedQuestion}"
            </h3>
            
            <textarea
              className="w-full bg-[#F5F5F5] border-2 border-[#E5E5E5] rounded-[16px] p-4 text-[#4B4B4B] font-medium text-[15px] focus:outline-none focus:border-[#1CB0F6] focus:bg-white resize-none"
              rows={8}
              placeholder="Ketikan draft jawaban ucapanmu di sini... (Minimal 1-2 paragraf) Rekomendasi: Gunakan metode STAR (Situation, Task, Action, Result)!"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="flex justify-end">
              <Button onClick={handleEvaluate} disabled={loading || !answer.trim()}>
                {loading ? "Mengevaluasi..." : "Cek Jawaban"}
              </Button>
            </div>
          </Card>

          {loading && (
             <Card className="p-6 text-center border-t-4 border-[#1CB0F6] bg-[#F5F5F5]">
                <p className="text-[#1CB0F6] font-bold text-[16px] animate-pulse">HRD AI sedang membaca dan menilai jawabanmu...</p>
             </Card>
          )}

          {evaluation && !loading && (
            <div style={{ borderTop: "4px solid " + getScoreColor(evaluation.score), borderRadius: "24px" }}>
              <Card className="p-6 h-full w-full">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-[80px] h-[80px] rounded-full flex flex-col items-center justify-center border-4" style={{ borderColor: getScoreColor(evaluation.score) }}>
                    <span className="font-['Fredoka_One'] text-[24px]" style={{ color: getScoreColor(evaluation.score) }}>
                      {evaluation.score}
                    </span>
                    <span className="text-[10px] font-bold text-[#AFAFAF]">/ 10</span>
                  </div>
                  <div>
                    <h3 className="text-[#4B4B4B] text-[20px] font-bold">Hasil Evaluasi HRD</h3>
                    <p className="text-[#777777] font-semibold text-[14px]">
                      {evaluation.score >= 8 ? "Kerja bagus! Jawabanmu meyakinkan." : evaluation.score >= 6 ? "Sudah lumayan, tapi bisa diperbaiki." : "Perlu perbaikan signifikan. Gunakan metode STAR."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-[#AFAFAF] text-[12px] font-bold uppercase tracking-[1px] mb-2">Feedback Rinci</h4>
                    <p className="text-[#4B4B4B] text-[15px] font-medium bg-[rgba(255,150,0,0.1)] p-4 rounded-2xl">
                      {evaluation.feedback}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[#AFAFAF] text-[12px] font-bold uppercase tracking-[1px] mb-2">Contoh Jawaban Ideal (Berdasarkan ceritamu)</h4>
                    <p className="text-[#4B4B4B] text-[15px] font-medium bg-[#F5F5F5] p-4 rounded-2xl italic border-l-4 border-[#58CC02]">
                      "{evaluation.improvedAnswer}"
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
