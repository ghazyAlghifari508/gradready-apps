"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, getSession } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada huruf kapital")
      .regex(/[0-9]/, "Harus ada angka"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const passwordStrength = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const strengthLabel = ["", "Lemah", "Sedang", "Kuat"][strengthScore];
  const strengthColor = ["", "var(--red)", "var(--golden)", "var(--green)"][
    strengthScore
  ];

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/onboarding",
      });

      if (result.error) {
        setServerError(
          result.error.message ?? "Gagal mendaftar. Coba lagi."
        );
      } else {
        // Check user role to determine redirect target
        const session = await getSession();
        if (session?.data?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/onboarding");
        }
      }
    } catch {
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ─── Left Panel ─── */}
      <div
        style={{
          flex: "0 0 420px",
          background: "var(--dark-blue)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          gap: 24,
        }}
        className="auth-left-panel"
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 40,
              color: "var(--green)",
              margin: 0,
            }}
          >
            gradready
          </h1>
        </Link>
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 15,
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 300,
            margin: 0,
          }}
        >
          Bergabung sekarang dan mulai perjalanan karir impianmu bersama ribuan
          fresh graduate Indonesia.
        </p>

        {/* Steps preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 8,
            width: "100%",
            maxWidth: 300,
          }}
        >
          {[
            { step: "01", title: "Daftar akun", desc: "Gratis selamanya" },
            { step: "02", title: "Pilih target job", desc: "5 kategori tersedia" },
            { step: "03", title: "Upload CV", desc: "Analisis AI instant" },
          ].map((item) => (
            <div
              key={item.step}
              style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
            >
              <span
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 20,
                  color: "var(--green)",
                  lineHeight: 1,
                  minWidth: 28,
                }}
              >
                {item.step}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    marginBottom: 2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right Panel: Form ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          backgroundColor: "var(--bg-white)",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "var(--gray-text)",
                marginBottom: 8,
              }}
            >
              Buat Akun Gratis
            </h2>
            <p style={{ fontSize: 14, color: "var(--gray-light)", margin: 0 }}>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                style={{
                  color: "var(--green)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Masuk
              </Link>
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div
              style={{
                backgroundColor: "rgba(255,75,75,0.08)",
                border: "1px solid rgba(255,75,75,0.25)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                fontSize: 13,
                color: "var(--red)",
                fontWeight: 600,
              }}
            >
              <AlertTriangle size={16} className="inline-block mr-2" /> {serverError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Input
              id="reg-name"
              label="Nama Lengkap"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="reg-email"
              label="Email"
              type="email"
              placeholder="nama@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <Input
                id="reg-password"
                label="Password"
                type="password"
                placeholder="Min. 8 karakter, huruf kapital & angka"
                error={errors.password?.message}
                {...register("password")}
              />
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 4, flex: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor:
                            i < strengthScore
                              ? strengthColor
                              : "var(--border-color)",
                          transition: "background-color 0.2s ease",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: strengthColor,
                    }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>
            <Input
              id="reg-confirm-password"
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* Terms */}
            <p
              style={{
                fontSize: 12,
                color: "var(--nav-text)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Dengan mendaftar, kamu menyetujui{" "}
              <Link
                href="/terms"
                style={{ color: "var(--blue)", fontWeight: 700 }}
              >
                Syarat &amp; Ketentuan
              </Link>{" "}
              GradReady.
            </p>

            <div style={{ marginTop: 4 }}>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                style={{ width: "100%" }}
              >
                {isLoading ? "MENDAFTAR..." : "DAFTAR GRATIS"}
              </Button>
            </div>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              href="/"
              style={{
                fontSize: 13,
                color: "var(--nav-text)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={14} className="inline-block mr-1" /> Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
