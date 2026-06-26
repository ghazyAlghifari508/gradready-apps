"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, Target, CheckCircle2, AlertCircle, HelpCircle, Zap, ShieldCheck, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  getApiErrorMessage,
  useQuotaExceededHandler,
} from "@/lib/auth-client";

interface GapDetail {
  skillId: string;
  skillName: string;
  status: "GREEN" | "YELLOW" | "RED";
  priority: "HIGH" | "MED" | "LOW";
}

interface SkillGap {
  id: string;
  readinessPct: number;
  gapDetailJson: GapDetail[];
  jobRoleId: string;
}

export default function SkillGapPage() {
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const handleQuotaExceeded = useQuotaExceededHandler();

  useEffect(() => {
    const controller = new AbortController();
    fetchGap(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchGap = async (signal?: AbortSignal) => {
    try {
      const _res = await fetch("/api/roadmap/progress", { signal });

      const analysisRes = await fetch("/api/skillgap/analyze", {
        method: "POST",
        signal,
      });
      const data = await analysisRes.json();
      if (!analysisRes.ok) {
        if (handleQuotaExceeded(data)) {
          setError("Kredit AI kamu habis untuk periode ini.");
          return;
        }
        setError(getApiErrorMessage(data, "Gagal memuat analisis skill gap."));
        return;
      }
      if (data.skillGap) {
        setSkillGap(data.skillGap);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat analisis skill gap.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await fetchGap();
    setIsAnalyzing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 flex flex-col items-center justify-center gap-4 text-gray-400">
        <Zap size={40} className="animate-bounce text-(--blue)" />
        <p className="font-bold text-lg">Menghitung jarak kompetensi...</p>
      </div>
    );
  }

  if (error || !skillGap) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Card className="p-16 border-dashed border-2 border-gray-200 rounded-[40px] bg-gray-50/30">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8">
            <Search size={48} className="text-gray-200" />
          </div>
          <h2 className="font-['Fredoka_One'] text-3xl text-(--dark-blue) mb-4">Belum Ada Analisis</h2>
          <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
            Kami memerlukan data dari CV Record terakhir Anda untuk mengukur seberapa siap Anda memenuhi kriteria lowongan incaran Anda.
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-10 py-6 rounded-2xl shadow-xl shadow-(--green)/20 transition-transform active:scale-95"
          >
            {isAnalyzing ? "Menganalisis..." : "Jalankan Analisis Sekarang"}
          </Button>
        </Card>
      </div>
    );
  }

  const gapDetails = skillGap.gapDetailJson;
  const highPriority = gapDetails.filter((g) => g.priority === "HIGH");
  const medPriority = gapDetails.filter((g) => g.priority === "MED");
  const lowPriority = gapDetails.filter((g) => g.priority === "LOW");

  const greenCount = gapDetails.filter((g) => g.status === "GREEN").length;
  const yellowCount = gapDetails.filter((g) => g.status === "YELLOW").length;
  const redCount = gapDetails.filter((g) => g.status === "RED").length;

  const pct = Math.round(skillGap.readinessPct);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "GREEN": return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "YELLOW": return "text-amber-500 bg-amber-50 border-amber-100";
      case "RED": return "text-rose-500 bg-rose-50 border-rose-100";
      default: return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  const renderSection = (title: string, skills: GapDetail[], icon: React.ReactNode) => {
    if (skills.length === 0) return null;
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 px-2">
          {icon}
          <h3 className="text-xl font-black text-(--dark-blue)">{title}</h3>
          <span className="ml-auto text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
            {skills.length} Skills
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill: GapDetail) => (
            <Card key={skill.skillId} className="p-5 border-gray-100 hover:border-gray-200 transition-all group rounded-[20px]">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-extrabold text-(--dark-blue) group-hover:text-(--blue) transition-colors">
                  {skill.skillName}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${getStatusColor(skill.status)}`}>
                    {skill.status === "GREEN" ? "Aman" : skill.status === "YELLOW" ? "Parsial" : "Kurang"}
                  </span>
                  {skill.status === "GREEN" ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : skill.status === "YELLOW" ? (
                    <AlertCircle size={16} className="text-amber-500" />
                  ) : (
                    <HelpCircle size={16} className="text-rose-500" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-(--blue) font-black text-xs uppercase tracking-widest mb-3">
          <Target size={14} /> Intelligence Analysis
        </div>
        <h1 className="font-['Fredoka_One'] text-4xl text-(--dark-blue) mb-3 uppercase tracking-tight">
          Skill Gap Analysis
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl">
          Pemetaan kompetensi antara profil Anda dan kriteria requirement industri aktual untuk target karir impian.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ── Left Sidebar: Overview ── */}
        <aside className="lg:col-span-4 space-y-8">
          <Card className="p-10 border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[40px] bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
             <div className="relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] block mb-6">Skor Kesiapan Industri</span>
                <div className="flex items-end gap-1 mb-4">
                  <span className={`text-7xl font-['Fredoka_One'] leading-none ${
                    pct >= 75 ? "text-emerald-500" : pct >= 50 ? "text-amber-500" : "text-rose-500"
                  }`}>
                    {pct}
                  </span>
                  <span className="text-2xl font-black text-gray-300 mb-1">%</span>
                </div>
                
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6 p-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                
                <p className="text-sm text-gray-500 font-medium italic leading-relaxed">
                  {pct >= 75 ? "Profil Anda sangat kompetitif untuk posisi ini!" : pct >= 50 ? "Anda memiliki dasar yang kuat, namun butuh penajaman di beberapa area." : "Fokus pada peningkatan skill teknis utama untuk meningkatkan daya saing."}
                </p>
             </div>
             {/* Decorative mesh */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-(--blue)/5 rounded-full blur-3xl" />
          </Card>

          <Card className="p-8 border-gray-100 shadow-xl shadow-gray-100/30 rounded-[32px] bg-white">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-6">Status Kompetensi</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-sm font-bold text-emerald-700">Dikuasai (Aman)</span>
                <span className="text-lg font-black text-emerald-600">{greenCount}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-sm font-bold text-amber-700">Parsial (Perlu Diasah)</span>
                <span className="text-lg font-black text-amber-600">{yellowCount}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-sm font-bold text-rose-700">Belum Memenuhi</span>
                <span className="text-lg font-black text-rose-600">{redCount}</span>
              </div>
            </div>
          </Card>
        </aside>

        {/* ── Right: Detailed Skills ── */}
        <div className="lg:col-span-8">
          {renderSection("Prioritas Tinggi (Wajib)", highPriority, <ShieldCheck size={24} className="text-rose-500" />)}
          {renderSection("Prioritas Menengah (Disarankan)", medPriority, <Star size={24} className="text-amber-500" />)}
          {renderSection("Prioritas Rendah (Nilai Plus)", lowPriority, <Zap size={24} className="text-emerald-500" />)}

          <div className="mt-12 p-10 bg-gradient-to-br from-(--dark-blue) to-[#1a1855] rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-(--dark-blue)/20">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-['Fredoka_One'] mb-4 text-(--green)">Tutup Jarak Karir Anda</h2>
              <p className="text-blue-100/70 font-medium text-lg leading-relaxed mb-8 max-w-xl">
                AI kami siap menyusun learning roadmap yang dipersonalisasi. Fokus pada skill berstatus merah dan kuning untuk meningkatkan Employability Score secara efisien.
              </p>
              <Link href="/roadmap" className="inline-flex items-center gap-3 bg-(--green) text-(--dark-blue) px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-transform">
                Lihat Learning Roadmap <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
