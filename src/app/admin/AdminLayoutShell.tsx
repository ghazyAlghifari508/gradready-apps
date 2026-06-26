"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/Toast";

import {
  BarChart2,
  Users,
  Briefcase,
  BookOpen,
  Newspaper,
  ArrowLeft
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart2, exact: true },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/job-roles", label: "Job Roles", icon: Briefcase },
  { href: "/admin/resources", label: "Sumber Belajar", icon: BookOpen },
  { href: "/admin/articles", label: "Artikel & Blog", icon: Newspaper },
];

function AdminNavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {adminNavItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: isActive ? 800 : 600,
              color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)",
              backgroundColor: isActive
                ? "rgba(88,204,2,0.2)"
                : "transparent",
              border: isActive
                ? "1px solid rgba(88,204,2,0.4)"
                : "1px solid transparent",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#FFFFFF";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }
            }}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ToastProvider>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-gray)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Admin Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          backgroundColor: "#1A1A2E",
          padding: "24px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minHeight: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Logo */}
        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
            padding: "0 12px",
          }}
        >
          <span
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 20,
              color: "#58CC02",
            }}
          >
            gradready
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#FFFFFF",
              backgroundColor: "#58CC02",
              padding: "2px 7px",
              borderRadius: 20,
              letterSpacing: "0.5px",
            }}
          >
            ADMIN
          </span>
        </Link>

        {/* Nav items */}
        <AdminNavLinks pathname={pathname} />

        {/* Bottom: Back to app */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 12,
            marginTop: 8,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            <ArrowLeft size={16} />
            Kembali ke App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
    </ToastProvider>
  );
}
