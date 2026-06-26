import DocBuilderPage from "@/components/doc-builder/DocBuilderPage";

export default function PortfolioPage() {
  return (
    <DocBuilderPage
      docType="PORTFOLIO"
      title="Portfolio Description"
      description="Buat deksripsi project yang berdampak dengan 2 varian untuk CV dan Repositori Anda."
      fields={[
        { id: "projectName", label: "Nama Project*", placeholder: "" },
        { id: "goal", label: "Tujuan / Latar Belakang*", placeholder: "Mengapa ini dibuat?" },
        { id: "impact", label: "Dampak (Impact / Hasil)*", placeholder: "Cth: Menghemat 10% waktu, dipakai 500 orang." },
        { id: "techStack", label: "Tech Stack (Opsional)", placeholder: "Next.js, Tailwind, Postgres..." },
      ]}
    />
  );
}
