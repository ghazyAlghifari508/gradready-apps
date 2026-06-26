"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { Bot } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type QuizQuestion = {
  id: string;
  questionText: string;
  options: string[];
};

export default function QuizTakePage() {
  const { showToast } = useToast();
  const params = useParams();
  const skillId = params.skillId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [skill, setSkill] = useState<{ name: string } | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    passed: boolean;
    scorePercentage: number;
    feedback: {
      questionId: string;
      isCorrect: boolean;
      correctOptionIndex: number;
      explanation: string;
    }[];
  } | null>(null);

  useEffect(() => {
    if (!skillId) return;
    const controller = new AbortController();
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz?skillId=${skillId}`, { signal: controller.signal });
        const data = await res.json();
        if (data.success) {
          setSkill(data.skill);
          setQuestions(data.questions);
        } else {
          showToast("Gagal memuat kuis.", "error");
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        showToast("Error loading quiz.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
    return () => controller.abort();
  }, [skillId]);

  const handleSelect = (qId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = async () => {
    const isAllAnswered = questions.every((q) => answers[q.id] !== undefined);
    if (!isAllAnswered) {
      showToast("Harap jawab semua pertanyaan terlebih dahulu!", "warning");
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const payload = questions.map((q: (typeof questions)[0]) => ({
        questionId: q.id,
        selectedIndex: answers[q.id],
      }));

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Unknown error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto text-center py-20 animate-pulse">
        <div className="w-[80px] h-[80px] bg-[rgba(28,176,246,0.1)] rounded-full mx-auto flex items-center justify-center mb-6">
          <Bot size={48} className="text-[#1CB0F6]" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1CB0F6] mb-2">
          AI sedang menyiapkan soal...
        </h2>
        <p className="text-[#777777] font-semibold text-[15px]">
          Tunggu sebentar, kami meracik tes khusus untukmu!
        </p>
      </div>
    );
  }

  if (result) {
    const { passed, scorePercentage, feedback } = result;
    return (
      <div className="max-w-[800px] mx-auto pb-20">
        <Card
          className="p-8 text-center border-t-8 mb-8"
          style={{ borderTopColor: passed ? "#58CC02" : "#FF4B4B" }}
        >
          <h1
            className="text-[32px] font-['Fredoka_One'] mb-2"
            style={{ color: passed ? "#4B4B4B" : "#FF4B4B" }}
          >
            {passed ? "Validasi Berhasil!" : "Validasi Gagal :("}
          </h1>
          <p className="text-[#777777] font-bold text-[16px] mb-6">
            Skor Kamu:{" "}
            <span className={passed ? "text-[#58CC02]" : "text-[#FF4B4B]"}>
              {Math.round(scorePercentage)}%
            </span>
          </p>
          {passed ? (
            <p className="text-[#58CC02] font-semibold mb-6">
              Selamat! Progress {skill?.name} milikmu telah ditingkatkan menjadi
              ACQUIRED.
            </p>
          ) : (
            <p className="text-[#FF4B4B] font-semibold mb-6">
              Kamu perlu mendapatkan skor di atas 80% untuk memvalidasi skill
              ini. Silakan belajar lebih lanjut dan coba lagi.
            </p>
          )}

          <Button
            variant={passed ? "secondary" : "primary"}
            onClick={() => router.push("/checklist")}
          >
            KEMBALI KE LIST KUIS
          </Button>
        </Card>

        <div className="flex flex-col gap-6">
          <h3 className="text-[#4B4B4B] font-bold text-[20px] mb-2 border-b-2 border-[#E5E5E5] pb-2">
            Review Jawabanmu
          </h3>
          {questions.map((q, idx) => {
            const fb = feedback.find(
              (f: {
                questionId: string;
                isCorrect: boolean;
                correctOptionIndex: number;
                explanation: string;
              }) => f.questionId === q.id,
            );
            return (
              <Card
                key={q.id}
                className="p-6 border-l-8"
                style={{
                  borderLeftColor: fb?.isCorrect ? "#58CC02" : "#FF4B4B",
                }}
              >
                <p className="text-[#4B4B4B] font-bold text-[16px] mb-4">
                  {idx + 1}. {q.questionText}
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx;
                    const isCorrectAnswer = fb?.correctOptionIndex === oIdx;
                    let bgClass = "bg-[#F5F5F5] text-[#777777]";
                    if (isCorrectAnswer)
                      bgClass =
                        "bg-[rgba(88,204,2,0.1)] text-[#58CC02] font-bold border-2 border-[#58CC02]";
                    else if (isSelected && !fb?.isCorrect)
                      bgClass =
                        "bg-[rgba(255,75,75,0.1)] text-[#FF4B4B] font-bold border-2 border-[#FF4B4B]";

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border-2 ${bgClass} ${isSelected && !isCorrectAnswer ? "" : "border-transparent"}`}
                      >
                        {opt} {isSelected && " (Pilihanmu)"}{" "}
                        {isCorrectAnswer && " (Jawaban Benar)"}
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 bg-[rgba(28,176,246,0.05)] rounded-xl border border-[rgba(28,176,246,0.2)]">
                  <p className="text-[13px] text-[#1CB0F6] font-semibold">
                    <span className="font-bold">Penjelasan:</span>{" "}
                    {fb?.explanation}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto pb-20">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-['Fredoka_One'] text-[#4B4B4B] mb-2 uppercase">
            Kuis Validasi: {skill?.name}
          </h1>
          <p className="text-[#777777] font-semibold">
            Jawab 5 pertanyaan cepat ini untuk membuktikan kemampuanmu.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 mb-8">
        {questions.map((q, idx) => (
          <Card key={q.id} className="p-6 border-[#E5E5E5]">
            <h3 className="font-bold text-[16px] text-[#4B4B4B] mb-4 leading-[1.6]">
              <span className="text-[#1CB0F6] mr-2">Q{idx + 1}.</span>{" "}
              {q.questionText}
            </h3>
            <div className="flex flex-col gap-3">
              {q.options.map((opt, optionIndex) => {
                const isSelected = answers[q.id] === optionIndex;
                return (
                  <div
                    key={optionIndex}
                    className={`p-4 rounded-[16px] border-2 cursor-pointer font-medium text-[15px] transition-colors ${isSelected ? "bg-[rgba(28,176,246,0.1)] border-[#1CB0F6] text-[#1CB0F6] font-bold" : "bg-[#F5F5F5] border-[#E5E5E5] text-[#4B4B4B] hover:border-[#AFAFAF]"}`}
                    onClick={() => handleSelect(q.id, optionIndex)}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Button
        className="w-full h-14 text-[18px]"
        onClick={handleSubmit}
        disabled={submitting || questions.length === 0}
      >
        {submitting ? "MEMPROSES..." : "SUBMIT JAWABAN"}
      </Button>
    </div>
  );
}
