import { useState } from "react";
import { saveVenta as saveVentaService } from "../services/ventas.service";
import type { VentaSave } from "../types/venta-save";

interface UseVentasResult {
  loading: boolean;
  saveVenta: (venta: VentaSave) => Promise<void>;
}

export function useVentas(): UseVentasResult {
  const [loading, setLoading] = useState(false);

  const saveVenta = async (venta: VentaSave): Promise<void> => {
    setLoading(true);

    try {
      await saveVentaService(venta);
    } finally {
      setLoading(false);
    }
  };

  return { loading, saveVenta };
}
