"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, BarChart2, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { StreakCounter } from "@/components/ui";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 64,
        backgroundColor: "var(--bg-white)",
        borderBottom: "2px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{ textDecoration: "none", flexShrink: 0 }}
      >
        <span
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 24,
            color: "var(--green)",
          }}
        >
          gradready
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      {/* Streak */}
      <StreakCounter count={3} />

      {/* User menu */}
      <div style={{ position: "relative" }}>
        <button
          id="navbar-user-menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 10,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.04)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "none")
          }
        >
          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--gray-text)",
                lineHeight: 1.2,
              }}
            >
              {session?.user?.name ?? "Loading..."}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--nav-text)",
                fontWeight: 600,
              }}
            >
              {session?.user?.email ?? ""}
            </div>
          </div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: menuOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
              color: "var(--nav-text)",
            }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              backgroundColor: "#FFFFFF",
              border: "2px solid var(--border-color)",
              borderRadius: 12,
              minWidth: 200,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--gray-text)",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <User size={16} />
              <span>Profil & Pengaturan</span>
            </Link>
            <Link
              href="/history"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--gray-text)",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <BarChart2 size={16} />
              <span>Riwayat & Progress</span>
            </Link>
            <div
              style={{ height: 1, backgroundColor: "var(--border-color)" }}
            />
            <button
              id="navbar-signout-btn"
              onClick={handleSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--red)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,75,75,0.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
