import { useMemo } from "react";
import type { Product, Sale } from "../../types";
import { fmt, fmtDate } from "../../utils/format";
import Card from "../atoms/Card";
import Badge from "../atoms/Badge";
import StatCard from "../molecules/StatCard";
import SaleRow from "../molecules/SaleRow";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

export default function Dashboard({ products, sales }: DashboardProps) {
  const todaySales = sales.filter((s) => s.date.toDateString() === new Date().toDateString());
  const todayTotal = todaySales.reduce((a, s) => a + s.total, 0);
  const weekTotal = sales.reduce((a, s) => a + s.total, 0);

  const chartData = useMemo(() => {
    const days: Record<string, number> = {};
    sales.forEach((s) => {
      const key = s.date.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" });
      days[key] = (days[key] || 0) + s.total;
    });
    return Object.entries(days).map(([day, total]) => ({ day, total }));
  }, [sales]);

  const recentSales = useMemo(() => [...sales].reverse().slice(0, 5), [sales]);

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Ventas hoy" value={fmt(todayTotal)} sub={`${todaySales.length} transacciones`} color="var(--primary)" />
        <StatCard label="Ventas semana" value={fmt(weekTotal)} sub={`${sales.length} transacciones`} />
        <StatCard label="Productos" value={String(products.length)} sub="en catálogo" />
      </div>

      <div className="two-col-grid" style={{ marginBottom: 16 }}>
        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, marginBottom: 20 }}>
            Ventas de los últimos 7 días
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [fmt(v), "Total"]} contentStyle={{ fontFamily: "var(--font-body)", fontSize: 13, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Bar dataKey="total" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
            Últimas ventas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentSales.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>#{s.id.toString().padStart(4, "0")}</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{fmtDate(s.date)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>{fmt(s.total)}</div>
                  <Badge variant={s.paymentMethod === "Efectivo" ? "success" : s.paymentMethod === "Tarjeta" ? "info" : "warning"} style={{ marginTop: 4 }}>
                    {s.paymentMethod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
