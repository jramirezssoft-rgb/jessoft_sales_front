import { useMemo, useState } from "react";
import type { Product, Sale } from "../../types";
import { fmt } from "../../utils/format";
import Card from "../atoms/Card";
import StatCard from "../molecules/StatCard";
import Button from "../atoms/Button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface ReportsPageProps {
  sales: Sale[];
  products: Product[];
}

export default function ReportsPage({ sales, products }: ReportsPageProps) {
  const [range, setRange] = useState<7 | 30>(7);

  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate() - range);
  const filtered = sales.filter((s) => s.date >= rangeDate);

  const totalRevenue = filtered.reduce((a, s) => a + s.total, 0);
  const totalTx = filtered.length;
  const avgTicket = totalTx ? totalRevenue / totalTx : 0;
  const totalUnits = filtered.reduce((a, s) => a + s.items.reduce((b, i) => b + i.qty, 0), 0);

  const byDay = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((s) => {
      const key = s.date.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
      map[key] = (map[key] || 0) + s.total;
    });
    return Object.entries(map).map(([day, total]) => ({ day, total }));
  }, [filtered]);

  const topProducts = useMemo(() => {
    const map: Record<number, { name: string; qty: number; total: number }> = {};
    filtered.forEach((s) =>
      s.items.forEach((i) => {
        if (!map[i.product.id]) map[i.product.id] = { name: i.product.name, qty: 0, total: 0 };
        map[i.product.id].qty += i.qty;
        map[i.product.id].total += i.product.salePrice * i.qty;
      })
    );
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [filtered]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Análisis de ventas y rendimiento</p>
        </div>
        <div style={{ display: "flex", gap: 6, background: "var(--card)", padding: 4, borderRadius: 10, border: "1px solid var(--border)" }}>
          {([7, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{ padding: "7px 14px", borderRadius: 7, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", background: range === r ? "var(--primary)" : "transparent", color: range === r ? "white" : "var(--muted-foreground)", transition: "all 0.15s", fontFamily: "var(--font-body)" }}
            >
              {r} días
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Ingresos" value={fmt(totalRevenue)} sub={`${totalTx} transacciones`} color="var(--primary)" />
        <StatCard label="Ticket promedio" value={fmt(avgTicket)} sub="por transacción" />
        <StatCard label="Unidades vendidas" value={String(totalUnits)} sub="artículos" color="var(--accent)" />
      </div>

      <div className="two-col-grid">
        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, marginBottom: 20 }}>
            Ingresos por día
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [fmt(v), "Ingresos"]} contentStyle={{ fontFamily: "var(--font-body)", fontSize: 13, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: "#4F46E5", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
            Top 5 productos
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {topProducts.map((p, i) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topProducts.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "var(--primary)" : "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i === 0 ? "white" : "var(--muted-foreground)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{p.qty} unidades</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary)", flexShrink: 0 }}>
                  {fmt(p.total)}
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, padding: "30px 0" }}>
                Sin datos en este período
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
