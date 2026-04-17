"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import { 
  Check, 
  Smartphone, 
  Globe, 
  Server, 
  BarChart2, 
  Palette, 
  Briefcase,
  AlertTriangle,
  FileText,
  PenTool,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";

interface JobRole {
  id: string;
  name: string;
  category: string;
  description?: string;
}

const STEPS = ["Target Job", "Data Diri", "Mulai Dari Mana?"] as const;

const ROLE_ICONS: Record<string, React.ElementType> = {
  "Mobile Developer": Smartphone,
  "Frontend Developer": Globe,
  "Backend Developer": Server,
  "Data Analyst": BarChart2,
  "UI/UX Designer": Palette,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/job-roles")
      .then((r) => r.json())
      .then((data) => setJobRoles(data.jobRoles ?? []))
      .catch(() => {});
  }, []);

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async (fork: "cv-analyzer" | "cv-builder") => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetJobId: selectedJobId,
          university: university || null,
          graduationYear: gradYear ? parseInt(gradYear) : null,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      router.push(`/${fork}`);
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-white)",
        fontFamily: "'Nunito', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 24px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <span
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 28,
            color: "var(--green)",
          }}
        >
          gradready
        </span>
      </div>

      {/* Step Indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 40,
        }}
      >
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor:
                    i < step
                      ? "var(--green)"
                      : i === step
                      ? "var(--green)"
                      : "var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: i <= step ? "#FFFFFF" : "var(--nav-text)",
                  transition: "all 0.3s ease",
                  boxShadow: i === step ? "0 0 0 4px rgba(88,204,2,0.15)" : "none",
                }}
              >
                {i < step ? <Check size={20} strokeWidth={3} /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: i === step ? "var(--green)" : "var(--nav-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 60,
                  height: 2,
                  backgroundColor:
                    i < step ? "var(--green)" : "var(--border-color)",
                  margin: "0 4px",
                  marginBottom: 22,
                  transition: "background-color 0.3s ease",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: step === 2 ? 640 : 560,
          backgroundColor: "#FFFFFF",
          border: "2px solid var(--border-color)",
          borderRadius: 20,
          padding: "36px 32px",
        }}
      >
        {/* ─── STEP 0: Pilih Job Role ─── */}
        {step === 0 && (
          <>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--gray-text)",
                marginBottom: 6,
              }}
            >
              Halo, {session?.user?.name?.split(" ")[0] ?? "Pengguna"}! <Sparkles size={20} className="inline-block text-[#FFD700]" />
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--gray-light)",
                marginBottom: 24,
              }}
            >
              Pilih target job role kamu. Ini akan jadi dasar analisis skill gap
              dan rekomendasi belajar.
            </p>

            {jobRoles.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px",
                  color: "var(--nav-text)",
                  fontSize: 14,
                }}
              >
                Memuat job roles...
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                {jobRoles.map((role) => {
                  const isSelected = selectedJobId === role.id;
                  return (
                    <button
                      key={role.id}
                      id={`job-role-${role.id}`}
                      onClick={() => setSelectedJobId(role.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 6,
                        padding: "16px",
                        borderRadius: 12,
                        border: isSelected
                          ? "2px solid var(--green)"
                          : "2px solid var(--border-color)",
                        backgroundColor: isSelected
                          ? "rgba(88,204,2,0.06)"
                          : "var(--bg-white)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div className={isSelected ? "text-[var(--green)]" : "text-[var(--gray-light)]"}>
                        {React.createElement(ROLE_ICONS[role.name] || Briefcase, { size: 32 })}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: isSelected
                            ? "var(--green)"
                            : "var(--gray-text)",
                        }}
                      >
                        {role.name}
                      </span>
                      {role.description && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--nav-text)",
                            lineHeight: 1.4,
                          }}
                        >
                          {role.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <Button
              variant="primary"
              disabled={!selectedJobId}
              onClick={goNext}
              style={{ width: "100%" }}
            >
              <span className="flex items-center justify-center gap-2">
                LANJUT <ArrowRight size={18} />
              </span>
            </Button>
          </>
        )}

        {/* ─── STEP 1: Data Diri ─── */}
        {step === 1 && (
          <>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--gray-text)",
                marginBottom: 6,
              }}
            >
              Data Diri (Opsional)
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--gray-light)",
                marginBottom: 24,
              }}
            >
              Informasi ini membantu kami membuat rekomendasi yang lebih
              personal. Bisa dilewati.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gray-text)",
                    marginBottom: 6,
                  }}
                >
                  Universitas
                </label>
                <input
                  id="onboarding-university"
                  type="text"
                  placeholder="Universitas Indonesia"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  style={{
                    height: 48,
                    border: "2px solid var(--border-color)",
                    borderRadius: 12,
                    padding: "0 16px",
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "'Nunito', sans-serif",
                    color: "var(--gray-text)",
                    width: "100%",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--blue)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border-color)")
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gray-text)",
                    marginBottom: 6,
                  }}
                >
                  Tahun Lulus
                </label>
                <select
                  id="onboarding-grad-year"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  style={{
                    height: 48,
                    border: "2px solid var(--border-color)",
                    borderRadius: 12,
                    padding: "0 16px",
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "'Nunito', sans-serif",
                    color: "var(--gray-text)",
                    width: "100%",
                    outline: "none",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Pilih tahun</option>
                  {Array.from({ length: 9 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 28,
              }}
            >
              <Button variant="secondary" onClick={goBack} style={{ flex: 1 }}>
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> KEMBALI
                </span>
              </Button>
              <Button variant="primary" onClick={goNext} style={{ flex: 2 }}>
                <span className="flex items-center justify-center gap-2">
                  LANJUT <ArrowRight size={18} />
                </span>
              </Button>
            </div>
          </>
        )}

        {/* ─── STEP 2: Fork ─── */}
        {step === 2 && (
          <>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--gray-text)",
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              Mulai Dari Mana? <Rocket size={24} className="inline-block text-[#FF9600]" />
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--gray-light)",
                marginBottom: 28,
                textAlign: "center",
              }}
            >
              Pilih langkah pertamamu di GradReady.
            </p>

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(255,75,75,0.08)",
                  border: "1px solid rgba(255,75,75,0.25)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 16,
                  fontSize: 13,
                  color: "var(--red)",
                  fontWeight: 600,
                }}
              >
                <AlertTriangle size={16} className="inline-block mr-2" /> {error}
              </div>
            )}

            <div
              style={{ display: "flex", gap: 16, flexDirection: "column" }}
            >
              {/* Fork A: Punya CV */}
              <button
                id="onboarding-fork-cv-analyzer"
                onClick={() => handleFinish("cv-analyzer")}
                disabled={saving}
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  border: "2px solid var(--border-color)",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--green)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(88,204,2,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                <FileText size={40} className="text-[var(--green)] flex-shrink-0" />
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "var(--gray-text)",
                      marginBottom: 4,
                    }}
                  >
                    Sudah Punya CV
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--gray-light)",
                      lineHeight: 1.5,
                    }}
                  >
                    Upload CV kamu dan dapatkan analisis AI lengkap — score,
                    skill yang terdeteksi, dan feedback per seksi.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--green)",
                      backgroundColor: "rgba(88,204,2,0.1)",
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    Ke CV Analyzer <ArrowRight size={14} />
                  </div>
                </div>
              </button>

              {/* Fork B: Belum Punya CV */}
              <button
                id="onboarding-fork-cv-builder"
                onClick={() => handleFinish("cv-builder")}
                disabled={saving}
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  border: "2px solid var(--border-color)",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--blue)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(28,176,246,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                <PenTool size={40} className="text-[var(--blue)] flex-shrink-0" />
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "var(--gray-text)",
                      marginBottom: 4,
                    }}
                  >
                    Belum Punya CV
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--gray-light)",
                      lineHeight: 1.5,
                    }}
                  >
                    Buat CV ATS-friendly dari nol dengan panduan langkah demi
                    langkah dan template profesional.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--blue)",
                      backgroundColor: "rgba(28,176,246,0.1)",
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    Ke CV Builder <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <Button
                variant="ghost"
                onClick={goBack}
                style={{ width: "100%" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> KEMBALI
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
