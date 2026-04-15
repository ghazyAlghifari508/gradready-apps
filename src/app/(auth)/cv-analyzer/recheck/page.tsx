"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, FileText, Upload, Sparkles, ArrowRight } from "lucide-react";
import styles from "./recheck.module.css";

interface ScoreBreakdown {
  format: number;
  atsKeywords: number;
  completeness: number;
  language: number;
  total: number;
}

interface CVRecord {
  id: string;
  versionNumber: number;
  score: number;
  parsedSkills: string[];
  feedbackJson: Record<string, { status: string; message: string }>;
  createdAt: string;
}

interface AnalysisResult {
  cvRecordId: string;
  score: ScoreBreakdown;
  parsedSkills: string[];
  feedbackJson: Record<string, { status: string; message: string }>;
  versionNumber: number;
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "var(--green)" : score >= 40 ? "var(--golden)" : "var(--red)";
  return (
    <div className={styles.scoreCircle}>
      <div className={styles.scoreNumber} style={{ color }}>{score}</div>
      <div className={styles.scoreLabel}>{label}</div>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return <span className={styles.deltaNeutral}>±0</span>;
  return (
    <span className={delta > 0 ? styles.deltaPositive : styles.deltaNegative}>
      {delta > 0 ? `+${delta}` : delta}
    </span>
  );
}

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
          <div className={styles.spinner} />
          <p className={styles.uploadingText}>AI sedang membaca CV baru Anda...</p>
        </div>
      ) : (
        <div className={styles.uploadIdle}>
          <div className={styles.uploadIcon}><Upload size={48} /></div>
          <p className={styles.uploadTitle}>{isDragging ? "Lepaskan di sini" : "Upload versi CV terbaru"}</p>
          <p className={styles.uploadHint}>PDF · Maks 5MB</p>
        </div>
      )}
    </div>
  );
}

export default function RecheckPage() {
  const [previousCV, setPreviousCV] = useState<CVRecord | null>(null);
  const [newResult, setNewResult] = useState<AnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cv/latest")
      .then(r => r.json())
      .then(d => { if (d.cv) setPreviousCV(d.cv); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cv/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Terjadi kesalahan"); return; }
      setNewResult(data);
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const delta = newResult && previousCV ? newResult.score.total - previousCV.score : null;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingCenter}>
          <div className={styles.spinner} />
          <p>Memuat data CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/cv-analyzer" className={styles.backBtn}><ArrowLeft size={16} /> Kembali</Link>
        <div>
          <h1 className={styles.title}>CV Re-check</h1>
          <p className={styles.subtitle}>Bandingkan versi CV lama vs CV baru Anda secara side-by-side</p>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {!previousCV ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><FileText size={64} /></div>
          <h3>Belum ada CV yang dianalisis</h3>
          <p>Upload CV Anda terlebih dahulu di halaman CV Analyzer.</p>
          <Link href="/cv-analyzer" className={styles.ctaPrimary}>Ke CV Analyzer</Link>
        </div>
      ) : (
        <div className={styles.compareLayout}>
          {/* Old CV */}
          <div className={styles.compareCard}>
            <div className={styles.compareCardHeader}>
              <span className={styles.compareLabel}>CV Sebelumnya</span>
              <span className={styles.versionBadge}>Versi #{previousCV.versionNumber}</span>
            </div>
            <ScoreCircle score={previousCV.score} label="Skor Lama" />
            <div className={styles.skillsOld}>
              <p className={styles.skillTitle}>Skill ({previousCV.parsedSkills?.length ?? 0})</p>
              <div className={styles.skillBadges}>
                {(previousCV.parsedSkills ?? []).slice(0, 10).map(s => (
                  <span key={s} className={styles.skillBadgeOld}>{s}</span>
                ))}
                {(previousCV.parsedSkills?.length ?? 0) > 10 && (
                  <span className={styles.moreSkills}>+{previousCV.parsedSkills.length - 10} lagi</span>
                )}
              </div>
            </div>
            <p className={styles.uploadedAt}>
              Diupload: {new Date(previousCV.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Middle Delta */}
          <div className={styles.middleColumn}>
            {newResult && delta !== null ? (
              <div className={styles.deltaSection}>
                <p className={styles.vsLabel}>Perubahan</p>
                <DeltaBadge delta={delta} />
                <p className={styles.deltaDesc}>
                  {delta > 0 ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      CV Anda meningkat! <Sparkles size={16} className="text-yellow-400" />
                    </span>
                  ) : delta < 0 ? (
                    "Skor menurun — cek feedback baru"
                  ) : (
                    "Skor tidak berubah"
                  )}
                </p>
              </div>
            ) : (
              <div className={styles.vsLabel}>VS</div>
            )}
          </div>

          {/* New CV */}
          <div className={styles.compareCard}>
            <div className={styles.compareCardHeader}>
              <span className={`${styles.compareLabel} ${styles.newLabel}`}>CV Terbaru</span>
              {newResult && <span className={styles.versionBadge}>Versi #{newResult.versionNumber}</span>}
            </div>
            {newResult ? (
              <>
                <ScoreCircle score={newResult.score.total} label="Skor Baru" />
                <div className={styles.skillsNew}>
                  <p className={styles.skillTitle}>Skill ({newResult.parsedSkills.length})</p>
                  <div className={styles.skillBadges}>
                    {newResult.parsedSkills.slice(0, 10).map(s => {
                      const isNew = !(previousCV.parsedSkills ?? []).includes(s);
                      return (
                        <span key={s} className={isNew ? styles.skillBadgeNew : styles.skillBadge}>
                          {isNew && <Sparkles size={12} style={{ display: "inline", marginRight: 4 }} />}{s}
                        </span>
                      );
                    })}
                    {newResult.parsedSkills.length > 10 && (
                      <span className={styles.moreSkills}>+{newResult.parsedSkills.length - 10} lagi</span>
                    )}
                  </div>
                  <p className={styles.newSkillHint}>
                    <Sparkles size={12} style={{ display: "inline", marginRight: 4 }} /> = skill baru yang tidak ada di CV lama
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.uploadArea}>
                <UploadZone onFile={handleFile} isUploading={isUploading} />
              </div>
            )}
          </div>
        </div>
      )}

      {newResult && (
        <div className={styles.newFeedback}>
          <h2 className={styles.feedbackTitle}>Detail Skor CV Terbaru</h2>
          <div className={styles.scoreGrid}>
            {[
              { label: "Format & Struktur", value: newResult.score.format, max: 20 },
              { label: "Keyword ATS", value: newResult.score.atsKeywords, max: 25 },
              { label: "Kelengkapan", value: newResult.score.completeness, max: 30 },
              { label: "Kualitas Bahasa", value: newResult.score.language, max: 25 },
            ].map(({ label, value, max }) => {
              const pct = (value / max) * 100;
              const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--golden)" : "var(--red)";
              return (
                <div key={label} className={styles.scoreItem}>
                  <div className={styles.scoreItemLabel}>{label}</div>
                  <div className={styles.scoreItemValue} style={{ color }}>{value}/{max}</div>
                  <div className={styles.scoreItemTrack}>
                    <div className={styles.scoreItemFill} style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.ctaRow}>
            <Link href="/skill-gap" className={styles.ctaPrimary}>
              Lanjut ke Skill Gap Analysis <ArrowRight size={18} />
            </Link>
            <Link href="/cv-analyzer" className={styles.ctaSecondary}>Lihat Analisis Lengkap</Link>
          </div>
        </div>
      )}
    </div>
  );
}
