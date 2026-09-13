import { type ReactNode, type SelectHTMLAttributes, useState } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Select({
  label,
  error,
  fullWidth,
  style,
  children,
  onFocus,
  onBlur,
  ...rest
}: SelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        width: fullWidth ? "100%" : undefined,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--foreground)",
            fontFamily: "var(--font-body)",
          }}
        >
          {label}
        </label>
      )}
      <select
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          padding: "9px 12px",
          border: `1.5px solid ${error ? "#EF4444" : focused ? "var(--primary)" : "var(--border)"}`,
          borderRadius: 8,
          outline: "none",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          background: "var(--muted)",
          color: "var(--foreground)",
          width: "100%",
          ...style,
        }}
        {...rest}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 12, color: "#EF4444" }}>{error}</span>}
    </div>
  );
}
