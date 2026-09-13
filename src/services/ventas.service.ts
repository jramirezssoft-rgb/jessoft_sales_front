import { http } from "../lib/http";
import type { VentaSave } from "../types/venta-save";

export async function saveVenta(venta: VentaSave): Promise<void> {
  await http.post("/ventas", venta);
}
