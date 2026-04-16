"use client";

import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, getSession } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

import { 
  AlertTriangle, 
  ArrowLeft, 
  Cpu, 
  BarChart2, 
  Map, 
  FileText,
  Star 
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl,
      });

      if (result.error) {
        setServerError(
          result.error.message ?? "Email atau password salah. Coba lagi."
        );
      } else {
        // Check user role to determine redirect target
        const session = await getSession();
        if (session?.data?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch {
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--gray-text)",
            marginBottom: 8,
          }}
        >
          Masuk ke Akun
        </h2>
        <p style={{ fontSize: 14, color: "var(--gray-light)", margin: 0 }}>
          Belum punya akun?{" "}
          <Link
            href="/register"
            style={{
              color: "var(--green)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Daftar gratis
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
          id="login-email"
          label="Email"
          type="email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="Minimal 8 karakter"
            error={errors.password?.message}
            {...register("password")}
          />
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <Link
              href="/forgot-password"
              style={{
                fontSize: 12,
                color: "var(--blue)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Lupa password?
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            {isLoading ? "MASUK..." : "MASUK"}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0",
        }}
      >
        <div
          style={{ flex: 1, height: 1, backgroundColor: "var(--border-color)" }}
        />
        <span
          style={{
            fontSize: 12,
            color: "var(--nav-text)",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          atau
        </span>
        <div
          style={{ flex: 1, height: 1, backgroundColor: "var(--border-color)" }}
        />
      </div>

      {/* Back to home */}
      <div style={{ textAlign: "center" }}>
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
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ─── Left Panel: Branding ─── */}
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
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 40,
              color: "var(--green)",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            gradready
          </h1>
        </Link>

        {/* Tagline */}
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
          Platform persiapan karir berbasis AI untuk fresh graduate Indonesia.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
          {[
            { value: "5K+", label: "Pengguna" },
            { value: "95%", label: "Lulus Screening" },
            { value: <div className="flex items-center justify-center gap-1">4.9<Star size={20} fill="var(--green)" stroke="none" /></div>, label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 24,
                  color: "var(--green)",
                  marginBottom: 2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 8,
            width: "100%",
            maxWidth: 300,
          }}
        >
          {[
            { text: "Analisis CV berbasis AI", icon: Cpu },
            { text: "Skill Gap Analysis", icon: BarChart2 },
            { text: "Roadmap belajar personal", icon: Map },
            { text: "AI Doc Builder", icon: FileText },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                fontWeight: 600,
              }}
            >
              <item.icon size={16} color="var(--green)" />
              {item.text}
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
        }}
      >
        <Suspense fallback={<div style={{ color: "var(--gray-light)" }}>Memuat...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Responsive: hide left panel on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
