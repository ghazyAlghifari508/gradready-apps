"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Input, TextArea } from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Tooltip from "@/components/ui/Tooltip";
import StreakCounter from "@/components/ui/StreakCounter";
import { FileText } from "lucide-react";

/**
 * Design System Preview Page
 * Shows all components from PRD Section 11.1
 * This page is for development only (not production)
 */

const colors = [
  { name: "Green", hex: "#58CC02", var: "--green" },
  { name: "Green Hover", hex: "#4BB200", var: "--green-hover" },
  { name: "Blue", hex: "#1CB0F6", var: "--blue" },
  { name: "Dark Blue", hex: "#100F3E", var: "--dark-blue" },
  { name: "Red", hex: "#FF4B4B", var: "--red" },
  { name: "Orange", hex: "#FF9600", var: "--orange" },
  { name: "Golden", hex: "#FFC800", var: "--golden" },
  { name: "Footer Green", hex: "#4EC604", var: "--footer-green" },
  { name: "Gray Text", hex: "#4B4B4B", var: "--gray-text" },
  { name: "Gray Light", hex: "#777777", var: "--gray-light" },
  { name: "Nav Text", hex: "#AFAFAF", var: "--nav-text" },
  { name: "Border", hex: "#E5E5E5", var: "--border-color" },
];

export default function DesignSystemPage() {
  const [toggleStates, setToggleStates] = useState({
    t1: false,
    t2: true,
    t3: false,
  });

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto" }}>
      {/* ============ NAVBAR ============ */}
      <nav
        style={{
          height: 64,
          backgroundColor: "var(--bg-white)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 22,
            color: "var(--green)",
          }}
        >
          GradReady
        </span>
        <span
          style={{
            width: 1,
            height: 24,
            backgroundColor: "var(--border-color)",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase" as const,
            letterSpacing: "0.5px",
            color: "var(--nav-text)",
          }}
        >
          STYLE GUIDE
        </span>
        <div style={{ flex: 1 }} />
        {["Colors", "Type", "Buttons", "Cards", "Components"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase" as const,
              letterSpacing: "0.5px",
              color: "var(--nav-text)",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--green)";
              e.currentTarget.style.backgroundColor = "rgba(88,204,2,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--nav-text)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* ============ HERO ============ */}
      <section
        style={{
          background:
            "linear-gradient(180deg, rgba(88,204,2,0.08) 0%, #FFFFFF 100%)",
          padding: "56px 40px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 52,
            color: "var(--green)",
            textTransform: "lowercase",
            marginBottom: 12,
          }}
        >
          gradready
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--gray-light)",
            maxWidth: 520,
            margin: "0 auto 24px",
            lineHeight: 1.5,
          }}
        >
          Design System Preview — Semua komponen UI yang digunakan di platform
          GradReady, terinspirasi dari Duolingo.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button variant="primary">MULAI SEKARANG</Button>
          <Button variant="secondary">SUDAH PUNYA AKUN</Button>
        </div>
      </section>

      {/* ============ MAIN GRID ============ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 1440,
        }}
      >
        {/* ---- COLORS ---- */}
        <section
          id="colors"
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Colors</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 12,
            }}
          >
            {colors.map((c) => (
              <div key={c.var} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "100%",
                    height: 56,
                    backgroundColor: c.hex,
                    borderRadius: 10,
                    border:
                      c.hex === "#E5E5E5" || c.hex === "#FFFFFF"
                        ? "1px solid #ccc"
                        : "none",
                  }}
                />
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 6,
                    color: "var(--gray-text)",
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--nav-text)",
                    fontFamily: "monospace",
                  }}
                >
                  {c.hex}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- TYPOGRAPHY ---- */}
        <section
          id="type"
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Typography</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: "block" }}>
                Display — Fredoka One 52px
              </span>
              <span className="text-display">gradready</span>
            </div>
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: "block" }}>
                Heading 1 — Nunito Bold 32px
              </span>
              <span className="text-h1">Heading Level One</span>
            </div>
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: "block" }}>
                Heading 2 — Fredoka One 28px
              </span>
              <span className="text-h2">heading level two</span>
            </div>
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: "block" }}>
                Body — Nunito Medium 18px
              </span>
              <span className="text-body">
                Platform web berbasis AI untuk fresh graduate Indonesia.
              </span>
            </div>
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: "block" }}>
                Caption — Nunito Bold 14px uppercase
              </span>
              <span className="text-caption">CAPTION TEXT SAMPLE</span>
            </div>
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: "block" }}>
                Small — Nunito Semi 12px
              </span>
              <span className="text-small">Small text sample for labels</span>
            </div>
          </div>
        </section>

        {/* ---- BUTTONS ---- */}
        <section
          id="buttons"
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Buttons</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="primary">PRIMARY</Button>
              <Button variant="primary" size="small">
                PRIMARY SM
              </Button>
              <Button variant="primary" disabled>
                DISABLED
              </Button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="secondary">SECONDARY</Button>
              <Button variant="danger">DANGER</Button>
              <Button variant="ghost">GHOST</Button>
            </div>
          </div>

          {/* Dark theme button */}
          <div
            style={{
              backgroundColor: "var(--dark-blue)",
              borderRadius: 12,
              padding: 20,
              marginTop: 16,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 12,
                display: "block",
              }}
            >
              Dark Theme
            </span>
            <Button variant="dark">DARK BUTTON</Button>
          </div>
        </section>

        {/* ---- BADGES ---- */}
        <section
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Badges</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <span className="text-caption" style={{ marginBottom: 8, display: "block" }}>
                Status Badges
              </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge variant="completed">Completed</Badge>
                <Badge variant="in-progress">In Progress</Badge>
                <Badge variant="failed">Failed</Badge>
                <Badge variant="streak">Streak</Badge>
                <Badge variant="premium">Premium</Badge>
              </div>
            </div>
            <div>
              <span className="text-caption" style={{ marginBottom: 8, display: "block" }}>
                Skill Gap Colors
              </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge variant="skill-green">Skill Dimiliki</Badge>
                <Badge variant="skill-yellow">Perlu Ditingkatkan</Badge>
                <Badge variant="skill-red">Belum Ada</Badge>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "var(--dark-blue)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Dark Theme Badges
              </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge variant="mastered">Mastered</Badge>
                <Badge variant="review">Review</Badge>
                <Badge variant="crown">Crown</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* ---- CARDS ---- */}
        <section
          id="cards"
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Cards</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card
              tag="CV ANALYZER"
              title="Analisis CV Kamu"
              description="Upload CV PDF dan dapatkan score, feedback, serta daftar skill yang terdeteksi."
              footerLeft="Fitur Utama"
              footerRight="MULAI"
            />
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  backgroundColor: "rgba(28,176,246,0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "var(--blue)"
                }}>
                  <FileText size={24} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--gray-text)",
                    }}
                  >
                    Simple Card
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gray-light)" }}>
                    Card with custom children content
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ---- PROGRESS BARS ---- */}
        <section
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Progress Bars</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <span className="text-small" style={{ marginBottom: 6, display: "block" }}>
                Default (Green) — 75%
              </span>
              <ProgressBar value={75} variant="default" />
            </div>
            <div>
              <span className="text-small" style={{ marginBottom: 6, display: "block" }}>
                In Progress (Blue) — 45%
              </span>
              <ProgressBar value={45} variant="in-progress" />
            </div>
            <div>
              <span className="text-small" style={{ marginBottom: 6, display: "block" }}>
                Low (Orange) — 20%
              </span>
              <ProgressBar value={20} variant="low" />
            </div>
            <div>
              <span className="text-small" style={{ marginBottom: 6, display: "block" }}>
                Complete — 100%
              </span>
              <ProgressBar value={100} variant="default" />
            </div>
          </div>
        </section>

        {/* ---- INPUTS ---- */}
        <section
          id="components"
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Inputs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Email" placeholder="nama@email.com" type="email" />
            <Input
              label="Password"
              placeholder="Minimal 8 karakter"
              type="password"
              error="Password terlalu pendek"
            />
            <TextArea label="Deskripsi" placeholder="Ceritakan tentang project kamu..." />
          </div>
        </section>

        {/* ---- TOGGLES + TOOLTIP + STREAK ---- */}
        <section
          style={{
            padding: "36px 40px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="section-label">Toggle, Tooltip, Streak</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Toggles */}
            <div>
              <span className="text-caption" style={{ marginBottom: 12, display: "block" }}>
                Toggle
              </span>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Toggle
                    checked={toggleStates.t1}
                    onChange={(v) =>
                      setToggleStates((s) => ({ ...s, t1: v }))
                    }
                  />
                  <span className="text-small">
                    {toggleStates.t1 ? "ON" : "OFF"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Toggle
                    checked={toggleStates.t2}
                    onChange={(v) =>
                      setToggleStates((s) => ({ ...s, t2: v }))
                    }
                  />
                  <span className="text-small">
                    {toggleStates.t2 ? "ON" : "OFF"}
                  </span>
                </div>
                <Toggle disabled />
              </div>
            </div>

            {/* Tooltip */}
            <div>
              <span className="text-caption" style={{ marginBottom: 12, display: "block" }}>
                Tooltip
              </span>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Tooltip content="Ini adalah tooltip!">Hover me</Tooltip>
                <Tooltip content="Lihat skill gap kamu di sini">
                  Skill Gap Info
                </Tooltip>
              </div>
            </div>

            {/* Streak Counter */}
            <div>
              <span className="text-caption" style={{ marginBottom: 12, display: "block" }}>
                Streak Counter
              </span>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StreakCounter count={3} />
                <StreakCounter count={7} />
                <StreakCounter count={14} />
                <StreakCounter count={30} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---- DARK CARD SECTION ---- */}
      <section
        style={{
          backgroundColor: "var(--dark-blue)",
          padding: "36px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase" as const,
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: 24,
          }}
        >
          Dark Cards
          <span
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <Card
            variant="dark"
            tag="ROADMAP"
            title="Learning Path"
            description="Ikuti timeline belajar yang dipersonalisasi untuk target job role kamu."
            footerLeft="12 Resources"
            footerRight="LIHAT"
          />
          <Card
            variant="dark"
            tag="QUIZ"
            title="Skill Verification"
            description="Validasi skill kamu dengan quiz interaktif per topik."
            footerLeft="5 Skills"
            footerRight="MULAI"
          />
        </div>

        {/* Language Pills — Section 11.1.12 */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase" as const,
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.4)",
              marginBottom: 12,
            }}
          >
            Category Pills
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Frontend", "Backend", "Mobile", "Data", "Design"].map(
              (cat, i) => (
                <span
                  key={cat}
                  style={{
                    display: "inline-flex",
                    padding: "6px 12px",
                    borderRadius: 12,
                    border: i === 0 ? "2px solid var(--green)" : "2px solid rgba(255,255,255,0.12)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    color: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                    backgroundColor:
                      i === 0 ? "rgba(88,204,2,0.08)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "24px 40px",
          borderTop: "1px solid var(--border-color)",
          textAlign: "center",
        }}
      >
        <span className="text-small">
          GradReady Design System — I/O Festival 2026
        </span>
      </footer>
    </div>
  );
}
