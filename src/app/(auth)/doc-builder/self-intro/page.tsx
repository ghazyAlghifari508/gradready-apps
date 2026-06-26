import DocBuilderPage from "@/components/doc-builder/DocBuilderPage";

export default function SelfIntroPage() {
  return (
    <DocBuilderPage
      docType="SELF_INTRO"
      title="Self-Intro Script"
      description="Script latihan 60-detik perkenalan diri (pitch) untuk interview atau networking."
      fields={[
        { id: "position", label: "Posisi Target Interview*", placeholder: "Cth: Frontend Engineer atau Management Trainee" },
        { id: "highlights", label: "Highlight Utama (Opsional)", type: "textarea", placeholder: "Hal terpenting yang wajib ditekankan, misalnya sertifikasi atau kemenangan lomba." },
      ]}
    />
  );
}
