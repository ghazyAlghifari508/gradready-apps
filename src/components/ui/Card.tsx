"use client";

import React from "react";

interface CardProps {
  variant?: "light" | "dark";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  imageUrl?: string;
  imageAlt?: string;
  tag?: string;
  title?: string;
  description?: string;
  footerLeft?: string;
  footerRight?: string;
  onFooterRightClick?: () => void;
}

/**
 * Card Component — PRD Section 11.1.5
 * Light card: white bg, 2px border, 16px radius, hover lift effect
 * Dark card: rgba bg on dark-blue background
 * Card with image: 120px image, tag, title, desc, footer
 */
export default function Card({
  variant = "light",
  children,
  className = "",
  style,
  interactive,
  onClick,
  imageUrl,
  imageAlt = "",
  tag,
  title,
  description,
  footerLeft,
  footerRight,
  onFooterRightClick,
}: CardProps) {
  const isStructured = !!(title || imageUrl);

  const lightStyles: React.CSSProperties = {
    background: "#FFFFFF",
    border: "2px solid var(--border-color)",
    borderRadius: 16,
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  };

  const darkStyles: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  };

  const cardStyle = variant === "light" ? lightStyles : darkStyles;

  if (isStructured) {
    return (
      <div
        className={`gr-card gr-card--${variant} ${className} ${interactive ? "cursor-pointer" : ""}`}
        style={{ ...cardStyle, ...style }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            variant === "light"
              ? "0 12px 32px rgba(0,0,0,0.08)"
              : "0 12px 32px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {imageUrl && (
          <div
            style={{
              height: 120,
              overflow: "hidden",
              borderRadius: "14px 14px 0 0",
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <div style={{ padding: "16px" }}>
          {tag && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color:
                  variant === "light" ? "var(--green)" : "rgba(255,255,255,0.7)",
                marginBottom: 6,
                display: "inline-block",
              }}
            >
              {tag}
            </span>
          )}
          {title && (
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: variant === "light" ? "var(--gray-text)" : "#FFFFFF",
                marginBottom: 6,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              style={{
                fontSize: 13,
                color:
                  variant === "light"
                    ? "var(--gray-light)"
                    : "rgba(255,255,255,0.5)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>
        {(footerLeft || footerRight) && (
          <div
            style={{
              borderTop:
                variant === "light"
                  ? "1px solid var(--border-color)"
                  : "1px solid rgba(255,255,255,0.08)",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color:
                  variant === "light"
                    ? "var(--nav-text)"
                    : "rgba(255,255,255,0.3)",
              }}
            >
              {footerLeft}
            </span>
            {footerRight && (
              <button
                onClick={onFooterRightClick}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--blue)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {footerRight}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Simple card with children
  return (
    <div
      className={`gr-card gr-card--${variant} ${className} ${interactive ? "cursor-pointer" : ""}`}
      style={{ ...cardStyle, padding: 24, ...style }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          variant === "light"
            ? "0 12px 32px rgba(0,0,0,0.08)"
            : "0 12px 32px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </div>
  );
}
