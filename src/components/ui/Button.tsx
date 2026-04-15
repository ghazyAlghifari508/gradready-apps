"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "dark";
type ButtonSize = "normal" | "small";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

/**
 * Button Component — PRD Section 11.1.4
 * Duolingo-inspired 3D button with shadow effect.
 * Variants: primary (green), secondary, danger, ghost, dark
 * Sizes: normal (48px), small (36px)
 */
export default function Button({
  variant = "primary",
  size = "normal",
  disabled = false,
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    textTransform: "uppercase",
    border: "none",
    cursor: disabled ? "default" : "pointer",
    transition: "all 0.1s ease",
    userSelect: "none",
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? "none" : "auto",
    fontFamily: "'Nunito', sans-serif",
    letterSpacing: "0.5px",
    ...(size === "normal"
      ? {
          height: 48,
          fontSize: 15,
          padding: "0 24px",
          borderRadius: 12,
        }
      : {
          height: 36,
          fontSize: 13,
          padding: "0 16px",
          borderRadius: 10,
        }),
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--green)",
      color: "#FFFFFF",
      boxShadow: "0 4px 0 var(--green-shadow)",
    },
    secondary: {
      backgroundColor: "transparent",
      border: "2px solid var(--secondary-border)",
      color: "var(--blue)",
      boxShadow: "0 4px 0 var(--secondary-border)",
    },
    danger: {
      backgroundColor: "var(--red)",
      color: "#FFFFFF",
      boxShadow: "0 4px 0 var(--danger-shadow)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--green)",
      boxShadow: "none",
      border: "none",
    },
    dark: {
      backgroundColor: "#FFFFFF",
      color: "var(--dark-blue)",
      boxShadow: "0 4px 0 var(--dark-btn-shadow)",
    },
  };

  const combinedStyles = { ...baseStyles, ...variantStyles[variant], ...style };

  return (
    <button
      className={`gr-button gr-button--${variant} ${className}`}
      style={combinedStyles}
      disabled={disabled}
      onMouseDown={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(4px)";
        el.style.boxShadow = "none";
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = variantStyles[variant].boxShadow || "none";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = variantStyles[variant].boxShadow || "none";
      }}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--green-hover)";
        } else if (variant === "ghost") {
          e.currentTarget.style.backgroundColor = "rgba(88,204,2,0.08)";
        } else if (variant === "dark") {
          e.currentTarget.style.backgroundColor = "#c8f040";
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor =
          variantStyles[variant].backgroundColor || "";
      }}
      {...props}
    >
      {children}
    </button>
  );
}
