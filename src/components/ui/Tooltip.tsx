"use client";

import React, { useState, useRef } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tooltip Component — PRD Section 11.1.10
 * Trigger: green text, 8% green bg, pill shape
 * Bubble: dark-blue bg, white text, arrow pointing down
 */
export default function Tooltip({
  content,
  children,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={triggerRef}
      className={`gr-tooltip ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--green)",
          backgroundColor: "rgba(88,204,2,0.08)",
          padding: "8px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {children}
      </span>

      {visible && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--dark-blue)",
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: 8,
            whiteSpace: "nowrap",
            zIndex: 100,
            fontFamily: "'Nunito', sans-serif",
            pointerEvents: "none",
          }}
        >
          {content}
          {/* Arrow */}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid var(--dark-blue)",
            }}
          />
        </span>
      )}
    </span>
  );
}
