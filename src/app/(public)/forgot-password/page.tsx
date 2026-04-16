"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
});
type ForgotForm = z.infer<typeof schema>;

import { Lock, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    // Simulate a short delay (email is not actually sent in dev)
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-white)",
        fontFamily: "'Nunito', sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 32,
                color: "var(--green)",
              }}
            >
              gradready
            </span>
          </Link>
        </div>

        {!submitted ? (
          <>
            <div style={{ marginBottom: 28, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 20, 
                  backgroundColor: "rgba(34,197,94,0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "var(--green)"
                }}>
                  <Lock size={32} />
                </div>
              </div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "var(--gray-text)",
                  marginBottom: 8,
                }}
              >
                Lupa Password?
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gray-light)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Masukkan email akunmu. Kami akan kirimkan link untuk reset
                password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <Input
                id="forgot-email"
                label="Email"
                type="email"
                placeholder="nama@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                style={{ width: "100%", marginTop: 4 }}
              >
                {isLoading ? "MENGIRIM..." : "KIRIM LINK RESET"}
              </Button>
            </form>
          </>
        ) : (
          /* Success State */
          <div
            style={{
              textAlign: "center",
              padding: "32px 24px",
              border: "2px solid var(--border-color)",
              borderRadius: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: "50%", 
                backgroundColor: "rgba(34,197,94,0.1)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--green)"
              }}>
                <Mail size={40} />
              </div>
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--gray-text)",
                marginBottom: 8,
              }}
            >
              Cek Email Kamu!
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--gray-light)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Kami telah mengirim link reset password ke{" "}
              <strong style={{ color: "var(--gray-text)" }}>
                {getValues("email")}
              </strong>
              . Klik link tersebut untuk membuat password baru.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--nav-text)",
                marginBottom: 24,
              }}
            >
              Tidak menerima email? Cek folder spam atau coba lagi.
            </p>
            <Button
              variant="secondary"
              onClick={() => setSubmitted(false)}
              style={{ width: "100%" }}
            >
              COBA LAGI
            </Button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            href="/login"
            style={{
              fontSize: 13,
              color: "var(--nav-text)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} className="inline-block mr-1" /> Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
