export const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export const calcMargin = (purchase: number, sale: number): number => {
  if (!purchase || purchase === 0) return 0;
  return parseFloat((((sale - purchase) / purchase) * 100).toFixed(1));
};

export const calcSaleFromMargin = (purchase: number, margin: number): number => {
  return parseFloat((purchase * (1 + margin / 100)).toFixed(2));
};
