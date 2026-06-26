import { extractText } from "unpdf";

function normalizeText(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\uFB01/g, "fi")
    .replace(/\uFB02/g, "fl")
    .replace(/\uFB00/g, "ff")
    .replace(/\uFB03/g, "ffi")
    .replace(/\uFB04/g, "ffl")
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    .replace(/[\u200C\u200D\uFEFF]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "- ")
    .replace(/ {2,}/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer);

  const result = await extractText(uint8Array);

  const rawText = Array.isArray(result.text)
    ? result.text.join("\n\n")
    : String(result.text);

  const fullText = normalizeText(rawText);

  console.log(
    `[PDF Extraction] Extracted ${fullText.length} chars from ${result.totalPages} page(s)`,
  );

  return fullText;
}
