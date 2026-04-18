// lib/pdf.ts — PDF text extraction using unpdf
// Phase 2: CV Analyzer
// Uses unpdf (vendored pdfjs build) to avoid worker configuration issues
// with pdfjs-dist v5 in Next.js 16 Turbopack environment.

import { extractText } from "unpdf";

/**
 * Normalize text extracted from PDFs.
 * Canva PDFs often use non-standard Unicode characters, ligatures,
 * and special whitespace that need to be cleaned up.
 */
function normalizeText(text: string): string {
  return text
    // Normalize Unicode (NFKD: compatibility decomposition)
    .normalize("NFKD")
    // Replace common ligatures
    .replace(/\uFB01/g, "fi")
    .replace(/\uFB02/g, "fl")
    .replace(/\uFB00/g, "ff")
    .replace(/\uFB03/g, "ffi")
    .replace(/\uFB04/g, "ffl")
    // Replace special whitespace characters with regular spaces
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    // Remove zero-width characters
    .replace(/[\u200C\u200D\uFEFF]/g, "")
    // Replace various dash/hyphen characters with a standard hyphen
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    // Replace smart quotes with regular quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace bullet-like characters with a dash
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "- ")
    // Collapse multiple spaces into one
    .replace(/ {2,}/g, " ")
    // Trim each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extract plain text from a PDF buffer.
 * Uses unpdf which ships its own vendored pdfjs build,
 * avoiding the worker configuration issues with pdfjs-dist v5 + Turbopack.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer);

  const result = await extractText(uint8Array);

  // unpdf returns text as an array (one element per page)
  const rawText = Array.isArray(result.text)
    ? result.text.join("\n\n")
    : String(result.text);

  const fullText = normalizeText(rawText);

  console.log(
    `[PDF Extraction] Extracted ${fullText.length} chars from ${result.totalPages} page(s)`
  );

  return fullText;
}
