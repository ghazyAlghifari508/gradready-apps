"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

type SkillProgress = {
  id: string;
  skillId: string;
  status: "GAP" | "IN_PROGRESS" | "ACQUIRED";
  scorePercentage: number;
  skill: {
    name: string;
    category: string;
  };
};

export default function QuizListPage() {
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/quiz");
        const data = await res.json();
        if (res.ok) {
          setSkills(data.skills);
        }
      } catch (err) {
        console.error("Failed to load skills for quiz");
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACQUIRED": return "#58CC02";
      case "IN_PROGRESS": return "#FF9600";
      default: return "#FF4B4B";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-6">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">Validasi Skill</h1>
        <p className="text-[#777777] font-semibold">Ikuti kuis singkat ini untuk mengubah status skill-mu menjadi <span className="text-[#58CC02] font-bold">Acquired!</span></p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-[#AFAFAF] font-bold animate-pulse">Memuat daftar skillmu...</div>
      ) : skills.length === 0 ? (
        <Card className="p-8 text-center text-[#AFAFAF] border-[#E5E5E5]">
          <div className="w-[100px] h-[100px] bg-[#F5F5F5] rounded-3xl mx-auto flex items-center justify-center mb-4">
             <BookOpen className="text-[#AFAFAF]" size={48} />
          </div>
          <p className="font-bold text-[18px]">Belum ada skill terdeteksi</p>
          <p className="text-[15px] font-medium max-w-md mx-auto mt-2">Upload resume kamu terlebih dahulu di bagian profil agar AI bisa mengukur gap kompetensimu.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s) => (
            <Card key={s.id} className="p-5 flex flex-col border-[#E5E5E5] justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="text-[11px] font-bold px-2 py-1 bg-[#F5F5F5] rounded-lg tracking-[1px] uppercase text-[#777777]">
                    {s.skill.category}
                  </div>
                  <div 
                    className="text-[11px] font-bold px-2 py-1 rounded-lg tracking-[1px] uppercase text-white"
                    style={{ backgroundColor: getStatusColor(s.status) }}
                  >
                    {s.status}
                  </div>
                </div>
                <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-2">{s.skill.name}</h3>
                <p className="text-[#AFAFAF] text-[13px] font-semibold mb-4">
                  Skor Terbaik: {s.scorePercentage ? `${Math.round(s.scorePercentage)}%` : "0%"}
                </p>
              </div>
              <Button 
                variant={s.status === "ACQUIRED" ? "secondary" : "primary"}
                className="w-full"
                onClick={() => router.push(`/quiz/${s.skillId}`)}
              >
                {s.status === "ACQUIRED" ? "ULANG KUIS" : "MULAI VALIDASI"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
