"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  totalCvRecords: number;
  avgScore: number;
}

import { 
  Users, 
  FileText, 
  Star, 
  Wrench, 
  Briefcase, 
  BookOpen, 
  User as UserIcon 
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Pengguna",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      color: "#1CB0F6",
    },
    {
      label: "Total CV Dianalisis",
      value: stats?.totalCvRecords ?? "—",
      icon: FileText,
      color: "#58CC02",
    },
    {
      label: "Rata-rata Skor CV",
      value: stats ? `${stats.avgScore}/100` : "—",
      icon: Star,
      color: "#FF9600",
    },
  ];

  return (
    <div>
      <h1
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 32,
          color: "#1A1A2E",
          marginBottom: 4,
        }}
      >
        Admin Dashboard
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "var(--gray-light)",
          marginBottom: 32,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Statistik platform GradReady secara keseluruhan.
      </p>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              border: "2px solid var(--border-color)",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: `${card.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.color,
                marginBottom: 4,
              }}
            >
              <card.icon size={22} />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                fontFamily: "'Fredoka One', cursive",
                color: card.color,
                lineHeight: 1,
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 60,
                    height: 32,
                    backgroundColor: "#F0F0F0",
                    borderRadius: 6,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ) : (
                card.value
              )}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--gray-light)",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          border: "2px solid var(--border-color)",
          padding: "24px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Wrench size={18} color="var(--blue)" />
          <h2
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#1A1A2E",
              fontFamily: "'Nunito', sans-serif",
              margin: 0
            }}
          >
            Akses Cepat
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            {
              href: "/admin/users",
              label: "Kelola Pengguna",
              desc: "Lihat & ubah role semua user",
              icon: Users,
            },
            {
              href: "/admin/job-roles",
              label: "Kelola Job Roles",
              desc: "Tambah & edit kategori job role",
              icon: Briefcase,
            },
            {
              href: "/admin/resources",
              label: "Kelola Sumber Belajar",
              desc: "Tambah link kursus & modul",
              icon: BookOpen,
            },
            {
              href: "/dashboard",
              label: "Lihat sebagai User",
              desc: "Buka dashboard mode pengguna",
              icon: UserIcon,
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                gap: 14,
                padding: "16px",
                border: "2px solid var(--border-color)",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.15s ease",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#58CC02";
                e.currentTarget.style.backgroundColor = "rgba(88,204,2,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 10, 
                backgroundColor: "var(--bg-gray)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--gray-text)"
              }}>
                <link.icon size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#1A1A2E",
                    fontFamily: "'Nunito', sans-serif",
                    marginBottom: 2,
                  }}
                >
                  {link.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--gray-light)",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {link.desc}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
