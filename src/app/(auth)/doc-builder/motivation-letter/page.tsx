import DocBuilderPage from "@/components/doc-builder/DocBuilderPage";

export default function MotivationLetterPage() {
  return (
    <DocBuilderPage
      docType="MOTIVATION"
      title="Motivation Letter Builder"
      description="Dokumen formal untuk mendeskripsikan motivasi Anda."
      showPdf
      fields={[
        { id: "companyName", label: "Nama Perusahaan*", placeholder: "Contoh: PT GoTo Gojek Tokopedia" },
        { id: "position", label: "Posisi Target*", placeholder: "Contoh: Junior Software Engineer" },
      ]}
    />
  );
}
