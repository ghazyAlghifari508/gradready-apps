import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

/**
 * Input Component — PRD Section 11.1.7
 * Height: 48px, border: 2px solid #E5E5E5, border-radius: 12px
 * Focus: border-color blue, Error: border-color red
 */

const inputBaseStyles: React.CSSProperties = {
  height: 48,
  border: "2px solid var(--border-color)",
  borderRadius: 12,
  padding: "0 16px",
  fontSize: 15,
  fontWeight: 600,
  fontFamily: "'Nunito', sans-serif",
  color: "var(--gray-text)",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s ease",
  backgroundColor: "var(--bg-white)",
};

const labelStyles: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--gray-text)",
  marginBottom: 6,
  fontFamily: "'Nunito', sans-serif",
};

const errorStyles: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--red)",
  marginTop: 4,
  fontFamily: "'Nunito', sans-serif",
};

export function Input({
  error,
  label,
  className = "",
  style,
  ...props
}: InputProps) {
  return (
    <div className={className} style={{ width: "100%" }}>
      {label && <label style={labelStyles}>{label}</label>}
      <input
        style={{
          ...inputBaseStyles,
          borderColor: error ? "var(--red)" : "var(--border-color)",
          ...style,
        }}
        onFocus={(e) => {
          if (!error)
            e.currentTarget.style.borderColor = "var(--blue)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "var(--red)"
            : "var(--border-color)";
        }}
        placeholder={props.placeholder}
        {...props}
      />
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
}

export function TextArea({
  error,
  label,
  className = "",
  style,
  ...props
}: TextAreaProps) {
  return (
    <div className={className} style={{ width: "100%" }}>
      {label && <label style={labelStyles}>{label}</label>}
      <textarea
        style={{
          ...inputBaseStyles,
          height: "auto",
          minHeight: 120,
          padding: "12px 16px",
          resize: "vertical",
          lineHeight: 1.5,
          borderColor: error ? "var(--red)" : "var(--border-color)",
          ...style,
        }}
        onFocus={(e) => {
          if (!error)
            e.currentTarget.style.borderColor = "var(--blue)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "var(--red)"
            : "var(--border-color)";
        }}
        {...props}
      />
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
}

export default Input;
