import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({ children, style, className, onClick, hoverable }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: "var(--card)",
        borderRadius: 14,
        border: "1px solid var(--border)",
        padding: 24,
        cursor: hoverable ? "pointer" : undefined,
        transition: hoverable ? "box-shadow 0.15s, border-color 0.15s" : undefined,
        ...style,
      }}
      onMouseEnter={hoverable ? (e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(79,70,229,0.1)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)";
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      } : undefined}
    >
      {children}
    </div>
  );
}
