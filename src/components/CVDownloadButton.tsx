// This component must be imported via Next.js dynamic() with ssr:false.
// It co-locates PDFDownloadLink and CVPDF so that @react-pdf/renderer's
// custom reconciler always receives the real Document element — never a
// Next.js LoadableComponent wrapper (which causes "su is not a function").

import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVPDF, type CVData, type CVMode } from "@/components/CVPDF";
import { CVCreativePDF } from "@/components/CVCreativePDF";

interface Props {
  data: CVData;
  fileName: string;
  mode?: CVMode;
}

export default function CVDownloadButton({ data, fileName, mode = "ats" }: Props) {
  const doc = mode === "creative" ? <CVCreativePDF data={data} /> : <CVPDF data={data} />;
  return (
    <PDFDownloadLink document={doc} fileName={fileName}>
      {({ loading }) => (
        <span
          aria-disabled={loading}
          aria-busy={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 40px",
            backgroundColor: loading ? "#9ca3af" : "var(--green, #16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            pointerEvents: loading ? "none" : "auto",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading
            ? mode === "creative"
              ? "Menyiapkan PDF Kreatif..."
              : "Menyiapkan PDF ATS..."
            : "⬇ Download CV (PDF)"}
        </span>
      )}
    </PDFDownloadLink>
  );
}
