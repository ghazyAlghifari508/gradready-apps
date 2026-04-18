"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

// We'll mock the PDF component for the CV to avoid inline complexity in this file.
// In reality, this requires a deeply structured PDF document standard.
import { StandardPDF } from "@/components/StandardPDF";

const STEPS = [
  "Personal Info", 
  "Summary", 
  "Education", 
  "Experience", 
  "Projects", 
  "Skills", 
  "Preview & Export"
];

export default function CVBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Base State for CV Data
  const [cvData, setCvData] = useState({
    personalInfo: { fullName: "", email: "", phone: "", linkedin: "", portfolio: "" },
    summary: "",
    education: [{ institution: "", degree: "", startYear: "", endYear: "", gpa: "" }],
    experience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    projects: [{ name: "", description: "", link: "" }],
    skills: ""
  });

  const nextStep = () => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1));
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  // Note: For fully working CV builder, we would map over education/experience array directly and allow add/remove.
  // For the constraint of this demo, we provide a structured single-entry form per array type.

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nama Lengkap</label>
                <Input value={cvData.personalInfo.fullName} onChange={e => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, fullName: e.target.value }})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <Input type="email" value={cvData.personalInfo.email} onChange={e => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, email: e.target.value }})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Nomor Telepon</label>
                <Input value={cvData.personalInfo.phone} onChange={e => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, phone: e.target.value }})} />
              </div>
              <div>
                <label className="block text-sm mb-1">LinkedIn URL</label>
                <Input value={cvData.personalInfo.linkedin} onChange={e => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, linkedin: e.target.value }})} />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
            <div>
              <label className="block text-sm mb-1">Ringkasan Karir (Gunakan AI di /doc-builder/linkedin untuk draf)</label>
              <textarea 
                className="w-full border rounded p-2 min-h-[150px]"
                value={cvData.summary}
                onChange={e => setCvData({ ...cvData, summary: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Pendidikan Terakhir</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1">Institusi / Universitas</label>
                <Input value={cvData.education[0].institution} onChange={e => setCvData({ ...cvData, education: [{ ...cvData.education[0], institution: e.target.value }]})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Gelar / Jurusan</label>
                <Input value={cvData.education[0].degree} onChange={e => setCvData({ ...cvData, education: [{ ...cvData.education[0], degree: e.target.value }]})} />
              </div>
              <div>
                <label className="block text-sm mb-1">GPA / IPK</label>
                <Input value={cvData.education[0].gpa} onChange={e => setCvData({ ...cvData, education: [{ ...cvData.education[0], gpa: e.target.value }]})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Tahun Masuk</label>
                <Input value={cvData.education[0].startYear} onChange={e => setCvData({ ...cvData, education: [{ ...cvData.education[0], startYear: e.target.value }]})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Tahun Lulus</label>
                <Input value={cvData.education[0].endYear} onChange={e => setCvData({ ...cvData, education: [{ ...cvData.education[0], endYear: e.target.value }]})} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Pengalaman Kerja</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nama Perusahaan</label>
                <Input value={cvData.experience[0].company} onChange={e => setCvData({ ...cvData, experience: [{ ...cvData.experience[0], company: e.target.value }]})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Peran / Posisi</label>
                <Input value={cvData.experience[0].role} onChange={e => setCvData({ ...cvData, experience: [{ ...cvData.experience[0], role: e.target.value }]})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Deskripsi & Dampak (Gunakan bullet points)</label>
                <textarea 
                  className="w-full border rounded p-2 min-h-[100px]"
                  value={cvData.experience[0].description}
                  onChange={e => setCvData({ ...cvData, experience: [{ ...cvData.experience[0], description: e.target.value }]})}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Project</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nama Project</label>
                <Input value={cvData.projects[0].name} onChange={e => setCvData({ ...cvData, projects: [{ ...cvData.projects[0], name: e.target.value }]})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Link (Opsional)</label>
                <Input value={cvData.projects[0].link} onChange={e => setCvData({ ...cvData, projects: [{ ...cvData.projects[0], link: e.target.value }]})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Deskripsi Project</label>
                <textarea 
                  className="w-full border rounded p-2 min-h-[100px]"
                  value={cvData.projects[0].description}
                  onChange={e => setCvData({ ...cvData, projects: [{ ...cvData.projects[0], description: e.target.value }]})}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Keahlian (Skills)</h2>
            <div>
              <label className="block text-sm mb-1">Daftar Keahlian (pisahkan dengan koma)</label>
              <textarea 
                className="w-full border rounded p-2 min-h-[100px]"
                placeholder="Next.js, React, Tailwind CSS, Python..."
                value={cvData.skills}
                onChange={e => setCvData({ ...cvData, skills: e.target.value })}
              />
            </div>
          </div>
        );
      case 6:
        // Build raw text representation of CV for PDF export fallback
        const cvRawText = `
NAME: ${cvData.personalInfo.fullName}
EMAIL: ${cvData.personalInfo.email}
PHONE: ${cvData.personalInfo.phone}
LINKEDIN: ${cvData.personalInfo.linkedin}

-- SUMMARY --
${cvData.summary}

-- EDUCATION --
${cvData.education[0].institution} - ${cvData.education[0].degree}
${cvData.education[0].startYear} to ${cvData.education[0].endYear} | GPA: ${cvData.education[0].gpa}

-- EXPERIENCE --
${cvData.experience[0].company} - ${cvData.experience[0].role}
${cvData.experience[0].description}

-- PROJECTS --
${cvData.projects[0].name} (${cvData.projects[0].link})
${cvData.projects[0].description}

-- SKILLS --
${cvData.skills}
        `;

        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Preview & Export</h2>
             <Card className="bg-gray-50 border whitespace-pre-wrap text-sm max-h-[300px] overflow-auto mb-4">
               {cvRawText}
             </Card>
             <p className="text-gray-500 text-sm mb-4">Catatan: Pastikan semua data sudah benar sebelum meng-export. File yang dihasilkan adalah format ATS-Friendly.</p>
             <div className="flex justify-center mt-4 border-t pt-4">
               <PDFDownloadLink
                  document={<StandardPDF content={cvRawText} title="Curriculum Vitae" />}
                  fileName={`${cvData.personalInfo.fullName.replace(/\s+/g,"_")}_CV.pdf`}
                >
                  {({ loading }) => (
                    <Button variant="primary" className="px-10" disabled={loading}>
                      {loading ? "Menyiapkan PDF ATS..." : "Download CV (PDF)"}
                    </Button>
                  )}
                </PDFDownloadLink>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-8">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">CV Builder Wizard</h1>
        <p className="text-[#777777] font-semibold">Panduan langkah demi langkah membangun resume ATS-Friendly.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {STEPS.map((step, idx) => (
          <div 
            key={idx} 
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2
              ${idx === currentStep ? 'bg-(--green) text-white' : 
                idx < currentStep ? 'bg-green-100 text-(--green)' : 'bg-gray-100 text-gray-400'}`}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">{idx + 1}</span>
            {step}
          </div>
        ))}
      </div>

      <Card className="border border-gray-200">
        <div className="min-h-[350px]">
          {renderStepContent()}
        </div>

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
            <div /> // We have the export button in the content, but we could put finish button here
          )}
        </div>
      </Card>
    </div>
  );
}
