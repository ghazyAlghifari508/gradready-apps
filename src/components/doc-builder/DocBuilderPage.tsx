"use client";

import React, { useState } from "react";
import { useDocGenerator } from "@/lib/useDocGenerator";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import dynamic from "next/dynamic";
import { StandardPDF } from "@/components/StandardPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

export interface DocField {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
}

interface Props {
  docType: string;
  title: string;
  description: string;
  fields: DocField[];
  showPdf?: boolean;
}

export default function DocBuilderPage({ docType, title, description, fields, showPdf }: Props) {
  const { loading, generatedText, setGeneratedText, handleGenerate, copyToClipboard } = useDocGenerator<Record<string, string>>(docType);

  const initialForm = Object.fromEntries(fields.map((f) => [f.id, ""])) as Record<string, string>;
  const [formData, setFormData] = useState<Record<string, string>>(initialForm);

  const onGenerate = () => handleGenerate(formData);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-(--green) mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Detail</h2>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.type === "select" && f.options ? (
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-(--green) focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                      value={formData[f.id]}
                      onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                    >
                      {f.options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm min-h-[80px]"
                      placeholder={f.placeholder}
                      value={formData[f.id]}
                      onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                    />
                  ) : (
                    <Input
                      placeholder={f.placeholder}
                      value={formData[f.id]}
                      onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button className="w-full" onClick={onGenerate} disabled={loading}>
                {loading ? "AI Memproses..." : "Generate"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
          <Card className="h-[400px] flex flex-col border border-gray-200 bg-gray-50 p-0 overflow-hidden">
            {!generatedText ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Hasil akan tampil di sini
              </div>
            ) : (
              <textarea
                className="flex-1 w-full p-6 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-(--green) text-gray-800 text-sm"
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
              />
            )}
          </Card>

          {generatedText && (
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={copyToClipboard}>
                Copy Teks
              </Button>
              {showPdf && (
                <PDFDownloadLink
                  document={<StandardPDF content={generatedText} title={title} />}
                  fileName={`${title.replace(/\s+/g, "_")}.pdf`}
                >
                  {({ loading: pdfLoading }) => (
                    <Button variant="primary" className="w-full" disabled={pdfLoading}>
                      {pdfLoading ? "Menyiapkan PDF..." : "Export PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
