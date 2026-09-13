import type { ReactNode } from "react";
import { Icons } from "../atoms/Icon";
import Button from "../atoms/Button";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  dismissible?: boolean;
}

export default function Modal({
  title,
  onClose,
  children,
  footer,
  width = 480,
  dismissible = false,
}: ModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => dismissible && e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--card)",
          borderRadius: 18,
          padding: 28,
          width: "100%",
          maxWidth: width,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 19,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </h2>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              style={{ padding: 6 }}
            >
              <Icons.x size={16} />
            </Button>
          )}
        </div>
        <div>{children}</div>
        {footer && <div style={{ marginTop: 22 }}>{footer}</div>}
      </div>
    </div>
  );
}
