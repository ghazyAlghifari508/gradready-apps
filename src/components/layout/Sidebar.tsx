"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import { 
  Home, 
  FileText, 
  PenTool, 
  BarChart2, 
  Map, 
  Bot, 
  Mic2, 
  Target, 
  Brain, 
  CheckCircle2, 
  Briefcase, 
  Settings,
  LineChart,
  History
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  group?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  // Main
  { href: "/dashboard", label: "Dashboard", icon: Home, group: "main" },
  // CV & Skill
  { href: "/cv-analyzer", label: "CV Analyzer", icon: FileText, group: "cv" },
  { href: "/cv-builder", label: "CV Builder", icon: PenTool, group: "cv" },
  { href: "/skill-gap", label: "Skill Gap", icon: BarChart2, group: "cv" },
  { href: "/roadmap", label: "Roadmap Belajar", icon: Map, group: "cv" },
  // AI Tools
  { href: "/doc-builder", label: "AI Doc Builder", icon: Bot, group: "ai" },
  { href: "/mock-interview", label: "Mock Interview", icon: Mic2, group: "ai" },
  { href: "/job-fit", label: "Job Fit", icon: Target, group: "ai" },
  // Tools
  { href: "/quiz", label: "Skill Quiz", icon: Brain, group: "tools" },
  { href: "/checklist", label: "Checklist", icon: CheckCircle2, group: "tools" },
  { href: "/saved-jobs", label: "Saved Jobs", icon: Briefcase, group: "tools" },
  // Admin
  { href: "/admin", label: "Admin Dashboard", icon: Settings, group: "admin", adminOnly: true },
];

const groupLabels: Record<string, string> = {
  main: "",
  cv: "CV & SKILL",
  ai: "AI TOOLS",
  tools: "TOOLS",
  admin: "ADMIN PANEL",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const allGroups = Array.from(new Set(navItems.map((i) => i.group)));
  const sidebarGroups = allGroups.filter(g => g !== "admin" || isAdmin);

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        backgroundColor: "var(--bg-white)",
        borderRight: "2px solid var(--border-color)",
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
        overflowY: "auto",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {sidebarGroups.map((group) => {
        const items = navItems.filter((i) => i.group === group);
        const label = groupLabels[group ?? ""] ?? "";
        return (
          <div key={group} style={{ marginBottom: 8 }}>
            {label && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "var(--nav-text)",
                  padding: "8px 12px 4px",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {label}
              </div>
            )}
            {items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;
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
                    fontSize: 14,
                    fontWeight: isActive ? 800 : 700,
                    color: isActive ? "var(--green)" : "var(--gray-text)",
                    backgroundColor: isActive
                      ? "rgba(88,204,2,0.08)"
                      : "transparent",
                    transition: "all 0.15s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0,0,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 20,
                        backgroundColor: "var(--green)",
                        borderRadius: "0 3px 3px 0",
                      }}
                    />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom Section: Profile & Market */}
      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          paddingTop: 12,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Link
          href="/market"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: pathname === "/market" ? 800 : 700,
            color: pathname === "/market" ? "var(--green)" : "var(--gray-text)",
            backgroundColor: pathname === "/market" ? "rgba(88,204,2,0.08)" : "transparent",
            transition: "all 0.1s ease",
          }}
          onMouseEnter={(e) => { if (pathname !== "/market") e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
          onMouseLeave={(e) => { if (pathname !== "/market") e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <LineChart size={18} strokeWidth={pathname === "/market" ? 2.5 : 2} />
          <span>Job Market</span>
        </Link>

        <Link
          href="/history"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: pathname === "/history" ? 800 : 700,
            color: pathname === "/history" ? "var(--green)" : "var(--gray-text)",
            backgroundColor: pathname === "/history" ? "rgba(88,204,2,0.08)" : "transparent",
            transition: "all 0.1s ease",
          }}
          onMouseEnter={(e) => { if (pathname !== "/history") e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
          onMouseLeave={(e) => { if (pathname !== "/history") e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <History size={18} strokeWidth={pathname === "/history" ? 2.5 : 2} />
          <span>History</span>
        </Link>
      </div>

      {/* User Quick Info */}
      {session && (
        <Link
          href="/profile"
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px",
            backgroundColor: pathname === "/profile" ? "rgba(28,176,246,0.06)" : "#F7F7F7",
            borderRadius: 12,
            textDecoration: "none",
            border: pathname === "/profile" ? "2px solid #1CB0F6" : "2px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "var(--light-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            {session.user.name?.slice(0, 2).toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--gray-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {session.user.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--gray-light)",
                fontWeight: 600,
              }}
            >
              My Profile
            </div>
          </div>
        </Link>
      )}
    </aside>
  );
}
