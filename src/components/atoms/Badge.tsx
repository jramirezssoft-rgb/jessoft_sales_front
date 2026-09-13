import type { CSSProperties, ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  default: { background: "#F1F5F9", color: "#64748B" },
  success: { background: "#ECFDF5", color: "#059669" },
  warning: { background: "#FFFBEB", color: "#D97706" },
  danger: { background: "#FEF2F2", color: "#EF4444" },
  info: { background: "#EEF2FF", color: "#4F46E5" },
  purple: { background: "#F5F3FF", color: "#7C3AED" },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
}

export default function Badge({ children, variant = "default", style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 6,
        fontFamily: "var(--font-body)",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
