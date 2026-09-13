import type { Product } from "../../types";
import { fmt } from "../../utils/format";
import Button from "../atoms/Button";
import { Icons } from "../atoms/Icon";
import Card from "../atoms/Card";

interface ProductTableProps {
  products: Product[];
  onEdit: (p: Product) => void;
}

const COLS = [
  "Producto",
  "Código",
  "SKU",
  "P. Compra",
  "P. Reventa",
  "% Ganancia",
];

export default function ProductTable({ products, onEdit }: ProductTableProps) {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}
        >
          <thead>
            <tr style={{ background: "var(--muted)" }}>
              {COLS.map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "12px 16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderTop: "1px solid var(--border)",
                  background:
                    i % 2 === 0 ? "transparent" : "rgba(248,250,252,0.5)",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    i % 2 === 0 ? "transparent" : "rgba(248,250,252,0.5)")
                }
              >
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {p.name}
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {p.barcode || "—"}
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: 13,
                    color: "var(--muted-foreground)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.sku || "—"}
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: 13,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {fmt(p.purchasePrice)}
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: 13,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {fmt(p.salePrice)}
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color:
                        p.profitMargin >= 30
                          ? "#10B981"
                          : p.profitMargin >= 15
                            ? "#F59E0B"
                            : "#EF4444",
                    }}
                  >
                    {p.profitMargin.toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(p)}
                      style={{ padding: "0 8px", height: 30, width: 30 }}
                    >
                      <Icons.edit size={13} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--muted-foreground)",
                    fontSize: 14,
                  }}
                >
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
