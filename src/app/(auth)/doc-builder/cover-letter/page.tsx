import DocBuilderPage from "@/components/doc-builder/DocBuilderPage";

export default function CoverLetterPage() {
  return (
    <DocBuilderPage
      docType="COVER"
      title="Cover Letter Builder"
      description="Surat lamaran yang disesuaikan spesifik untuk deskripsi pekerjaan target."
      showPdf
      fields={[
        { id: "companyName", label: "Nama Perusahaan*", placeholder: "Contoh: PT Bangun Bangsa" },
        { id: "position", label: "Posisi Target*", placeholder: "Contoh: Data Analyst" },
        { id: "jobDescription", label: "Job Description (Teks)*", type: "textarea", placeholder: "Paste isi requirement kerjaan dari LinkedIn disini..." },
      ]}
    />
  );
}
