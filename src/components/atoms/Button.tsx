import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--primary)", color: "white", border: "none" },
  secondary: { background: "transparent", color: "var(--muted-foreground)", border: "1.5px solid var(--border)" },
  ghost: { background: "transparent", color: "var(--foreground)", border: "none" },
  danger: { background: "transparent", color: "#EF4444", border: "1.5px solid #FECACA" },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: 12, borderRadius: 7, height: 32 },
  md: { padding: "9px 16px", fontSize: 14, borderRadius: 9, height: 38 },
  lg: { padding: "12px 20px", fontSize: 15, borderRadius: 10, height: 46 },
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s, box-shadow 0.15s",
        width: fullWidth ? "100%" : undefined,
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex", width: size === "sm" ? 14 : 16, height: size === "sm" ? 14 : 16 }}>{icon}</span>}
      {children}
    </button>
  );
}
