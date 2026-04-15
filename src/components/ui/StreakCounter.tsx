import React from "react";

interface StreakCounterProps {
  count: number;
  className?: string;
}

/**
 * StreakCounter Component — PRD Section 11.1.11
 * Inline-flex, orange 10% bg, pill shape
 * Fire symbol 18px + number 16px weight 800 orange
 */
import { Flame } from "lucide-react";

export default function StreakCounter({
  count,
  className = "",
}: StreakCounterProps) {
  return (
    <div
      className={`gr-streak ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        backgroundColor: "rgba(255,150,0,0.10)",
        borderRadius: 20,
      }}
    >
      <Flame size={18} color="var(--orange)" fill="var(--orange)" />
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "var(--orange)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {count}
      </span>
    </div>
  );
}
