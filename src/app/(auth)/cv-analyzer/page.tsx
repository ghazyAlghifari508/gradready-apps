"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, XCircle, FileText, RefreshCcw, Paperclip, ArrowRight } from "lucide-react";
import styles from "./cv-analyzer.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScoreBreakdown {
  format: number;
  atsKeywords: number;
  completeness: number;
  language: number;
  total: number;
}

interface FeedbackItem {
  status: "good" | "warning" | "error";
  message: string;
}

interface AnalysisResult {
  cvRecordId: string;
  score: ScoreBreakdown;
  parsedSkills: string[];
  feedbackJson: Record<string, FeedbackItem>;
  versionNumber: number;
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--green)" : score >= 40 ? "var(--golden)" : "var(--red)";
  const label = score >= 70 ? "Bagus!" : score >= 40 ? "Perlu Perbaikan" : "Butuh Perbaikan";

  return (
    <div className={styles.gaugeWrapper}>
      <svg height={radius * 2} width={radius * 2} className={styles.gaugeSvg}>
        <circle stroke="#E5E5E5" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color} fill="transparent" strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
          style={{ transition: "stroke-dashoffset 1s ease-in-out", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      <div className={styles.gaugeCenter}>
        <span className={styles.gaugeScore} style={{ color }}>{score}</span>
        <span className={styles.gaugeMax}>/100</span>
        <span className={styles.gaugeLabel} style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--golden)" : "var(--red)";
  return (
    <div className={styles.scoreBarRow}>
      <div className={styles.scoreBarLabel}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div className={styles.scoreBarTrack}>
        <div className={styles.scoreBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Feedback Card ────────────────────────────────────────────────────────────
const FEEDBACK_ICONS: Record<string, React.ReactNode> = { 
  good: <CheckCircle className="text-green-500" size={18} />, 
  warning: <AlertTriangle className="text-yellow-500" size={18} />, 
  error: <XCircle className="text-red-500" size={18} /> 
};
const SECTION_LABELS: Record<string, string> = {
  summary: "Ringkasan Profil", experience: "Pengalaman Kerja",
  education: "Pendidikan", skills: "Daftar Skill",
  contact: "Informasi Kontak", format: "Format & Struktur", ats: "Keyword ATS",
};

function FeedbackCard({ sectionKey, item }: { sectionKey: string; item: FeedbackItem }) {
  const statusClass = item.status === "good" ? styles.feedbackGood : item.status === "warning" ? styles.feedbackWarning : styles.feedbackError;
  return (
    <div className={`${styles.feedbackCard} ${statusClass}`}>
      <span className={styles.feedbackIcon}>{FEEDBACK_ICONS[item.status]}</span>
      <div>
        <div className={styles.feedbackSection}>{SECTION_LABELS[sectionKey] ?? sectionKey}</div>
        <div className={styles.feedbackMsg}>{item.message}</div>
      </div>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onFile, isUploading }: { onFile: (file: File) => void; isUploading: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") onFile(file);
  }, [onFile]);

  return (
    <div
      className={`${styles.uploadZone} ${isDragging ? styles.dragging : ""} ${isUploading ? styles.uploading : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept=".pdf" className={styles.hiddenInput}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {isUploading ? (
        <div className={styles.uploadingState}>
          <div className={styles.aiSpinner} />
          <p className={styles.uploadingText}>AI sedang membaca CV Anda...</p>
          <p className={styles.uploadingSubtext}>Proses ini membutuhkan 15–30 detik</p>
        </div>
      ) : (
        <div className={styles.uploadIdleState}>
          <div className={styles.uploadIcon}><FileText size={48} /></div>
          <p className={styles.uploadTitle}>{isDragging ? "Lepaskan file di sini" : "Drag & drop CV Anda di sini"}</p>
          <p className={styles.uploadSubtitle}>atau klik untuk memilih file</p>
          <span className={styles.uploadHint}>PDF · Maksimal 5MB</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CVAnalyzerPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [hasPreviousCV, setHasPreviousCV] = useState(false);

  useEffect(() => {
    fetch("/api/cv/latest").then(r => r.json()).then(d => { if (d.cv) setHasPreviousCV(true); }).catch(() => {});
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setError(null);
    setResult(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cv/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Terjadi kesalahan saat menganalisis CV"); return; }
      setResult(data);
      setHasPreviousCV(true);
    } catch {
      setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>CV Analyzer</h1>
          <p className={styles.subtitle}>Upload CV Anda dan dapatkan analisis mendalam + saran perbaikan dari AI</p>
        </div>
        {hasPreviousCV && (
          <Link href="/cv-analyzer/recheck" className={styles.recheckBtn}>
            <RefreshCcw size={16} /> Re-check CV Baru
          </Link>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertTriangle size={20} />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span>{error}</span>
            {error.includes("Canva") && (
              <p style={{ fontSize: "0.85rem", fontWeight: 400, opacity: 0.9, marginTop: "4px" }}>
                <strong>Tips Canva:</strong> Saat download, pilih <strong>PDF Standard</strong> dan pastikan opsi <strong>&quot;Flatten PDF&quot;</strong> <u>TIDAK</u> dicentang agar teks tetap terbaca oleh AI.
              </p>
            )}
          </div>
        </div>
      )}

      {!result && (
        <div className={styles.uploadSection}>
          <UploadZone onFile={handleFile} isUploading={isUploading} />
          {fileName && !isUploading && (
            <p className={styles.selectedFile}>
              <Paperclip size={14} /> {fileName}
            </p>
          )}
        </div>
      )}

      {result && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <div className={styles.fileInfo}>
              <span className={styles.fileBadge}><FileText size={14} /> {fileName}</span>
              <span className={styles.versionBadge}>Versi #{result.versionNumber}</span>
            </div>
            <button className={styles.reuploadBtn} onClick={() => { setResult(null); setFileName(null); }}>
              Upload CV Lain
            </button>
          </div>

          <div className={styles.resultGrid}>
            {/* Score Panel */}
            <div className={styles.scorePanel}>
              <h2 className={styles.panelTitle}>Skor CV Kamu</h2>
              <ScoreGauge score={result.score.total} />
              <div className={styles.scoreBreakdown}>
                <h3 className={styles.breakdownTitle}>Rincian Skor</h3>
                <ScoreBar label="Format & Struktur" value={result.score.format} max={20} />
                <ScoreBar label="Keyword ATS" value={result.score.atsKeywords} max={25} />
                <ScoreBar label="Kelengkapan" value={result.score.completeness} max={30} />
                <ScoreBar label="Kualitas Bahasa" value={result.score.language} max={25} />
              </div>
            </div>

            {/* Detail Panel */}
            <div className={styles.detailPanel}>
              <div className={styles.skillsSection}>
                <h2 className={styles.panelTitle}>
                  Skill Terdeteksi <span className={styles.skillCount}>{result.parsedSkills.length} skill</span>
                </h2>
                <div className={styles.skillBadges}>
                  {result.parsedSkills.length > 0
                    ? result.parsedSkills.map(s => <span key={s} className={styles.skillBadge}>{s}</span>)
                    : <p className={styles.noSkills}>Tidak ada skill teknis terdeteksi. Pastikan CV memiliki section Skills yang jelas.</p>
                  }
                </div>
              </div>

              <div className={styles.feedbackSection}>
                <h2 className={styles.panelTitle}>Feedback per Section</h2>
                <div className={styles.feedbackList}>
                  {Object.entries(result.feedbackJson).map(([key, item]) => (
                    <FeedbackCard key={key} sectionKey={key} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <Link href="/skill-gap" className={styles.ctaPrimary}>
              Lanjut ke Skill Gap Analysis <ArrowRight size={18} />
            </Link>
            <Link href="/cv-analyzer/recheck" className={styles.ctaSecondary}>
              Upload versi CV yang lebih baru
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
