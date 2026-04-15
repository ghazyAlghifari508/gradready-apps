import React from "react";

type ProgressVariant = "default" | "in-progress" | "low";

interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

/**
 * ProgressBar Component — PRD Section 11.1.9
 * Track: 12px height, #E5E5E5 bg, border-radius 6px
 * Fill: green (default), blue (in-progress), orange (low)
 * Transition: width 0.6s ease
 * Label: 12px bold, 32px wide, right-aligned
 */

const fillColors: Record<ProgressVariant, string> = {
  default: "var(--green)",
  "in-progress": "var(--blue)",
  low: "var(--orange)",
};

export default function ProgressBar({
  value,
  variant = "default",
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`gr-progress ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 12,
          backgroundColor: "var(--border-color)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clampedValue}%`,
            backgroundColor: fillColors[variant],
            borderRadius: 6,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            width: 32,
            textAlign: "right",
            color: "var(--gray-text)",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
