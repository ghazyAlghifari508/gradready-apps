"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { type CVData, type CVMode } from "@/components/CVPDF";
import { useToast } from "@/components/ui/Toast";
import StepPersonal from "@/components/cv-builder/StepPersonal";
import StepSummary from "@/components/cv-builder/StepSummary";
import StepEducation from "@/components/cv-builder/StepEducation";
import StepExperience from "@/components/cv-builder/StepExperience";
import StepProjects from "@/components/cv-builder/StepProjects";
import StepSkills from "@/components/cv-builder/StepSkills";
import StepPreview from "@/components/cv-builder/StepPreview";

// ── Steps ─────────────────────────────────────────────────────────────────
const STEPS = [
  "Personal Info",
  "Summary",
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Preview & Export",
];

// placeholder to satisfy the return statement below before it is removed

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CVBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<CVMode>("ats");
  const isCreative = mode === "creative";
  const { showToast } = useToast();
  const [revising, setRevising] = useState(false);
  const [reviseInstruction, setReviseInstruction] = useState("");
  const [showRevise, setShowRevise] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleRevise = async () => {
    if (!reviseInstruction.trim() || revising) return;
    setRevising(true);
    try {
      const res = await fetch("/api/cv/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, instruction: reviseInstruction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Gagal merevisi CV.");
      setCvData(data.revised as CVData);
      setReviseInstruction("");
      setShowRevise(false);
      showToast("CV berhasil direvisi AI.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal merevisi CV.", "error");
    } finally {
      setRevising(false);
    }
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Gagal generate CV dengan AI.");
      setCvData(data.generated as CVData);
      showToast("CV berhasil di-generate AI.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal generate CV.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      headline: "",
      photo: "",
      location: "",
    },
    summary: "",
    languages: "",
    certifications: "",
    education: [
      { institution: "", degree: "", startYear: "", endYear: "", gpa: "" },
    ],
    experience: [
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ],
    projects: [{ name: "", description: "", link: "" }],
    skills: "",
  });

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <StepPersonal cvData={cvData} setCvData={setCvData} isCreative={isCreative} showToast={showToast} />;
      case 1: return <StepSummary cvData={cvData} setCvData={setCvData} />;
      case 2: return <StepEducation cvData={cvData} setCvData={setCvData} />;
      case 3: return <StepExperience cvData={cvData} setCvData={setCvData} />;
      case 4: return <StepProjects cvData={cvData} setCvData={setCvData} />;
      case 5: return <StepSkills cvData={cvData} setCvData={setCvData} isCreative={isCreative} />;
      case 6: return (
        <StepPreview
          cvData={cvData}
          mode={mode}
          isCreative={isCreative}
          generating={generating}
          handleGenerate={handleGenerate}
          showRevise={showRevise}
          setShowRevise={setShowRevise}
          reviseInstruction={reviseInstruction}
          setReviseInstruction={setReviseInstruction}
          revising={revising}
          handleRevise={handleRevise}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-6">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">
          CV Builder Wizard
        </h1>
        <p className="text-[#777777] font-semibold">
          {isCreative
            ? "Bangun CV Kreatif dengan foto & desain berwarna untuk lamaran langsung ke rekruter."
            : "Bangun resume ATS-Friendly yang mudah dibaca sistem screening otomatis HRD."}
        </p>
      </div>

      {/* Mode Toggle: ATS vs Creative (non-ATS) */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {(
          [
            {
              key: "ats" as CVMode,
              title: "CV ATS-Friendly",
              desc: "Format polos, lolos screening otomatis.",
            },
            {
              key: "creative" as CVMode,
              title: "CV Kreatif (Non-ATS)",
              desc: "Foto, warna & headline untuk kesan visual.",
            },
          ]
        ).map((opt) => {
          const active = mode === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setMode(opt.key)}
              className={`text-left rounded-2xl p-4 border-2 transition-colors flex-1 min-w-[240px] ${
                active
                  ? "border-(--green) bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-4 h-4 rounded-full border-2 ${
                    active ? "border-(--green) bg-(--green)" : "border-gray-300"
                  }`}
                />
                <span className="font-bold text-[15px] text-[var(--dark-blue)]">
                  {opt.title}
                </span>
              </div>
              <p className="text-xs text-[#777777] font-semibold ml-6">
                {opt.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Step Indicators */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2
              ${
                idx === currentStep
                  ? "bg-(--green) text-white"
                  : idx < currentStep
                    ? "bg-green-100 text-(--green)"
                    : "bg-gray-100 text-gray-400"
              }`}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">
              {idx + 1}
            </span>
            {step}
          </div>
        ))}
      </div>

      <Card className="border border-gray-200">
        <div className="min-h-[350px]">{renderStepContent()}</div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            &larr; Sebelumnya
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button variant="primary" onClick={nextStep}>
              Lanjut &rarr;
            </Button>
          ) : (
            <div />
          )}
        </div>
      </Card>
    </div>
  );
}
