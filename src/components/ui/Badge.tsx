import React from "react";

type BadgeVariant =
  | "completed"
  | "in-progress"
  | "failed"
  | "streak"
  | "premium"
  | "mastered"
  | "review"
  | "crown"
  | "skill-green"
  | "skill-yellow"
  | "skill-red";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

/**
 * Badge Component — PRD Section 11.1.6
 * Pill shape, 12px font, weight 800, uppercase
 * Light variants: COMPLETED, IN_PROGRESS, FAILED, STREAK, PREMIUM
 * Dark variants: MASTERED, REVIEW, CROWN
 * Skill gap: GREEN (#58CC02), YELLOW (#FFC800), RED (#FF4B4B)
 */

const variantMap: Record<
  BadgeVariant,
  { color: string; background: string }
> = {
  completed: {
    color: "var(--green)",
    background: "rgba(88,204,2,0.12)",
  },
  "in-progress": {
    color: "var(--blue)",
    background: "rgba(28,176,246,0.12)",
  },
  failed: {
    color: "var(--red)",
    background: "rgba(255,75,75,0.12)",
  },
  streak: {
    color: "var(--orange)",
    background: "rgba(255,150,0,0.12)",
  },
  premium: {
    color: "#b8920f",
    background: "rgba(255,200,0,0.15)",
  },
  mastered: {
    color: "#7ADB2E",
    background: "rgba(88,204,2,0.15)",
  },
  review: {
    color: "#4DC4F8",
    background: "rgba(28,176,246,0.15)",
  },
  crown: {
    color: "#FFC800",
    background: "rgba(255,200,0,0.15)",
  },
  "skill-green": {
    color: "var(--green)",
    background: "rgba(88,204,2,0.12)",
  },
  "skill-yellow": {
    color: "var(--golden)",
    background: "rgba(255,200,0,0.15)",
  },
  "skill-red": {
    color: "var(--red)",
    background: "rgba(255,75,75,0.12)",
  },
};

export default function Badge({
  variant,
  children,
  className = "",
}: BadgeProps) {
  const styles = variantMap[variant];

  return (
    <span
      className={`gr-badge gr-badge--${variant} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: styles.color,
        backgroundColor: styles.background,
        whiteSpace: "nowrap",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {children}
    </span>
  );
}
