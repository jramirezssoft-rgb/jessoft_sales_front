import type { Sale } from "../../types";
import { fmt, fmtDate } from "../../utils/format";
import Badge from "../atoms/Badge";

interface SaleRowProps {
  sale: Sale;
  index: number;
}

const methodVariant = (m: Sale["paymentMethod"]) => {
  if (m === "Efectivo") return "success" as const;
  if (m === "Tarjeta") return "info" as const;
  return "warning" as const;
};

export default function SaleRow({ sale, index }: SaleRowProps) {
  return (
    <tr
      style={{ borderTop: "1px solid var(--border)", transition: "background 0.1s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
      onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? "transparent" : "rgba(248,250,252,0.5)")}
    >
      <td style={{ padding: "10px 20px", fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
        #{sale.id.toString().padStart(4, "0")}
      </td>
      <td style={{ padding: "10px 20px", fontSize: 13 }}>{fmtDate(sale.date)}</td>
      <td style={{ padding: "10px 20px", fontSize: 13 }}>{sale.items.reduce((a, i) => a + i.qty, 0)} artículos</td>
      <td style={{ padding: "10px 20px" }}>
        <Badge variant={methodVariant(sale.paymentMethod)}>{sale.paymentMethod}</Badge>
      </td>
      <td style={{ padding: "10px 20px", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
        {fmt(sale.total)}
      </td>
    </tr>
  );
}
