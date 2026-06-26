import DocBuilderPage from "@/components/doc-builder/DocBuilderPage";

export default function LinkedInPage() {
  return (
    <DocBuilderPage
      docType="LINKEDIN"
      title="LinkedIn About Generator"
      description="Buat Summary LinkedIn yang mengesankan perekrut."
      fields={[
        { id: "industry", label: "Industri Target*", placeholder: "Contoh: Digital Marketing, Tech, dll" },
        { id: "tone", label: "Tone (Gaya Bahasa)*", type: "select", options: [
          { value: "professional", label: "Profesional & Formal" },
          { value: "creative", label: "Kreatif & Energik" },
          { value: "storytelling", label: "Storytelling (Bercerita)" },
        ]},
        { id: "highlights", label: "Key Highlights (Opsional)", type: "textarea", placeholder: "Prestasi atau project yang wajib disebut..." },
      ]}
    />
  );
}
