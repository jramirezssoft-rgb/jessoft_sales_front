import { type InputHTMLAttributes, type ReactNode, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  prefix,
  suffix,
  error,
  fullWidth,
  style,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: fullWidth ? "100%" : undefined }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: `1.5px solid ${error ? "#EF4444" : focused ? "var(--primary)" : "var(--border)"}`,
          borderRadius: 8,
          background: "var(--muted)",
          transition: "border-color 0.15s",
          overflow: "hidden",
        }}
      >
        {prefix && (
          <span style={{ display: "flex", alignItems: "center", paddingLeft: 10, color: "var(--muted-foreground)", flexShrink: 0 }}>
            {prefix}
          </span>
        )}
        <input
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          style={{
            flex: 1,
            padding: "9px 12px",
            border: "none",
            outline: "none",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            background: "transparent",
            color: "var(--foreground)",
            width: "100%",
            ...style,
          }}
          {...rest}
        />
        {suffix && (
          <span style={{ display: "flex", alignItems: "center", paddingRight: 10, color: "var(--muted-foreground)", flexShrink: 0 }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: "#EF4444" }}>{error}</span>}
    </div>
  );
}
