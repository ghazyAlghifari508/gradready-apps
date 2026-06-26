"use client";

import React, { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({
  checked: controlledChecked,
  onChange,
  disabled = false,
  className = "",
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    if (!isControlled) setInternalChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      className={`gr-toggle ${className}`}
      onClick={handleToggle}
      disabled={disabled}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: isChecked ? "var(--green)" : "var(--border-color)",
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        transition: "background-color 0.2s ease",
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: isChecked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}
