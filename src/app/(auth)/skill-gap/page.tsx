"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./skill-gap.module.css";

import { Search, ArrowRight } from "lucide-react";

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


  useEffect(() => {
    fetchGap();
  }, []);

  const fetchGap = async () => {
    try {
      const _res = await fetch("/api/roadmap/progress"); // wait, roadmap progress only returns roadmap progress. We should just call GET /api/roadmap/:userId? Or we can fetch the skillgap object!
      // Actually, we don't have an endpoint strictly for GET /api/skillgap. 
      // Let's call POST /api/skillgap/analyze which will regenerate or just use an inline server action in a real app.
      // Better yet, I'll update the server to return the existing one if doing a GET... Wait, I didn't write a GET for api/skillgap.
      // For now, let's just trigger the POST analysis on mount if no gap exists.
      
      const analysisRes = await fetch("/api/skillgap/analyze", {
        method: "POST",
      });
      const data = await analysisRes.json();
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
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>Memuat Analisis...</div>
        </div>
      </div>
    );
  }

  if (error || !skillGap) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><Search size={48} /></div>
          <h2 className={styles.emptyTitle}>Belum Ada Analisis</h2>
          <p className={styles.emptyDesc}>
            Kami memerlukan data dari CV Record terakhir Anda untuk mengukur seberapa siap Anda memenuhi kriteria lowongan incaran Anda.
          </p>
          <button onClick={handleAnalyze} disabled={isAnalyzing} className={styles.btnPrimary}>
            {isAnalyzing ? "Menganalisis..." : "Jalankan Analisis Sekarang"}
          </button>
        </div>
      </div>
    );
  }

  const gapDetails = skillGap.gapDetailJson;
  const highPriority = gapDetails.filter(g => g.priority === "HIGH");
  const medPriority = gapDetails.filter(g => g.priority === "MED");
  const lowPriority = gapDetails.filter(g => g.priority === "LOW");

  const greenCount = gapDetails.filter(g => g.status === "GREEN").length;
  const yellowCount = gapDetails.filter(g => g.status === "YELLOW").length;
  const redCount = gapDetails.filter(g => g.status === "RED").length;

  const pct = Math.round(skillGap.readinessPct);
  const color = pct >= 70 ? "var(--green, #10b981)" : pct >= 40 ? "var(--golden, #fbbf24)" : "var(--red, #ef4444)";

  const renderSection = (title: string, skills: GapDetail[]) => {
    if (skills.length === 0) return null;
    return (
      <div className={styles.prioritySection}>
        <div className={styles.priorityHeader}>
          <h3 className={styles.priorityTitle}>{title}</h3>
          <span className={styles.badgeCount}>{skills.length} Skills</span>
        </div>
        <div className={styles.skillGrid}>
          {skills.map(skill => (
            <div key={skill.skillId} className={styles.skillCard}>
              <span className={styles.skillName}>{skill.skillName}</span>
              <div className={`${styles.statusIndicator} ${styles[`status${skill.status}`]}`} title={skill.status} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Skill Gap Analysis</h1>
        <p className={styles.subtitle}>Pemetaan kompetensi antara CV Anda dan requirement industri aktual.</p>
      </header>

      <div className={styles.dashboard}>
        {/* Overview Column */}
        <aside className={styles.overviewPanel}>
          <div className={styles.readinessSection}>
            <span className={styles.readinessLabel}>Skor Kesiapan Industri</span>
            <div className={styles.readinessScore}>{pct}%</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Berdasarkan target job role Anda.
            </p>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.timelineLabel}>Total Requirement</span>
              <span className={styles.timelineValue}>{gapDetails.length} Skills</span>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineLabel}>Dikuasai (Aman)</span>
              <span className={styles.timelineValue} style={{color: "var(--green, #10b981)"}}>{greenCount}</span>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineLabel}>Parsial (Kurang)</span>
              <span className={styles.timelineValue} style={{color: "var(--golden, #fbbf24)"}}>{yellowCount}</span>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineLabel}>Belum Dikuasai</span>
              <span className={styles.timelineValue} style={{color: "var(--red, #ef4444)"}}>{redCount}</span>
            </div>
          </div>
        </aside>

        {/* Detailed Skills Column */}
        <div className={styles.detailPanel}>
          {renderSection("Prioritas Tinggi (Wajib)", highPriority)}
          {renderSection("Prioritas Menengah (Disarankan)", medPriority)}
          {renderSection("Prioritas Rendah (Nilai Plus)", lowPriority)}
        </div>
      </div>

      <div className={styles.roadmapBanner}>
        <h2 className={styles.bannerTitle}>Tutup Jarak Karir Anda</h2>
        <p className={styles.bannerDesc}>
          AI kami siap menyusun learning roadmap yang dipersonalisasi. Fokus pada skill berstatus merah dan kuning untuk meningkatkan Employability Score secara efisien.
        </p>
        <Link href="/roadmap" className={styles.btnLight}>
          Lihat Learning Roadmap <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
