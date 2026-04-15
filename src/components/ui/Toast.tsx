"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { Check, X, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const typeStyles: Record<ToastType, React.CSSProperties> = {
    success: {
      backgroundColor: "#58CC02",
      color: "#FFFFFF",
      borderLeft: "4px solid #4EC604",
    },
    error: {
      backgroundColor: "#FF4B4B",
      color: "#FFFFFF",
      borderLeft: "4px solid #CC3B3B",
    },
    warning: {
      backgroundColor: "#FFA500",
      color: "#FFFFFF",
      borderLeft: "4px solid #CC8400",
    },
    info: {
      backgroundColor: "#1CB0F6",
      color: "#FFFFFF",
      borderLeft: "4px solid #148FCC",
    },
  };

  const typeIcons: Record<ToastType, React.ReactNode> = {
    success: <Check size={14} strokeWidth={3} />,
    error: <X size={14} strokeWidth={3} />,
    warning: <AlertTriangle size={14} strokeWidth={3} />,
    info: <Info size={14} strokeWidth={3} />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              ...typeStyles[toast.type],
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Nunito', sans-serif",
              minWidth: 260,
              maxWidth: 380,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              cursor: "pointer",
              pointerEvents: "auto",
              animation: "toastIn 0.3s ease forwards",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.25)",
                fontSize: 12,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {typeIcons[toast.type]}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
