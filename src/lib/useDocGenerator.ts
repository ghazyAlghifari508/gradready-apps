"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  getApiErrorMessage,
  useQuotaExceededHandler,
} from "@/lib/auth-client";

export function useDocGenerator<TForm extends Record<string, string>>(docType: string) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const handleQuotaExceeded = useQuotaExceededHandler();

  const handleGenerate = async (formData: TForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/doc/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, inputs: formData }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedText(data.doc.contentText);
      } else if (handleQuotaExceeded(data)) {
        return;
      } else {
        showToast("Gagal memproses AI: " + getApiErrorMessage(data, "Gagal memproses AI"), "error");
      }
    } catch {
      showToast("Error generate doc", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    showToast("Berhasil disalin ke clipboard!", "success");
  };

  return { loading, generatedText, setGeneratedText, handleGenerate, copyToClipboard, showToast };
}
