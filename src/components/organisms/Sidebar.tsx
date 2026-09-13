import { useState } from "react";
import type { Page } from "../../types";
import { Icons } from "../atoms/Icon";

const NAV: { id: Page; label: string; Icon: (p: { size?: number }) => JSX.Element }[] = [
  { id: "dashboard", label: "Dashboard", Icon: Icons.dashboard },
  { id: "products", label: "Productos", Icon: Icons.products },
  { id: "sales", label: "Ventas", Icon: Icons.sales },
  { id: "reports", label: "Reportes", Icon: Icons.reports },
];

interface SidebarProps {
  page: Page;
  onNav: (p: Page) => void;
}

function NavItem({ item, active, onClick }: { item: (typeof NAV)[0]; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
        background: active ? "rgba(79,70,229,0.18)" : hovered ? "rgba(255,255,255,0.05)" : "transparent",
        color: active ? "#A5B4FC" : hovered ? "#CBD5E1" : "#64748B",
        fontFamily: "var(--font-body)", fontSize: 14, fontWeight: active ? 600 : 400,
        marginBottom: 2, transition: "all 0.15s", textAlign: "left",
      }}
    >
      <item.Icon size={17} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", flexShrink: 0 }} />}
    </button>
  );
}

export default function Sidebar({ page, onNav }: SidebarProps) {
  return (
    <aside style={{ background: "var(--sidebar)", width: 220, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "var(--primary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#F8FAFC", letterSpacing: "-0.01em" }}>VentasPro</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>Punto de Venta</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "14px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
          Menú
        </div>
        {NAV.map((item) => (
          <NavItem key={item.id} item={item} active={page === item.id} onClick={() => onNav(item.id)} />
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "#94A3B8", flexShrink: 0 }}>
            MG
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>María García</div>
            <div style={{ fontSize: 11, color: "#475569" }}>Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
