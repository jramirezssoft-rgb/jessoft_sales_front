import { useEffect, useState } from "react";
import { getUnidadesMedida } from "../services/unidades-medida.service";
import type { UnidadMedida } from "../types/unidad-medida";

interface UseUnidadesMedidaResult {
  unidades: UnidadMedida[];
  loading: boolean;
  error: string | null;
}

export function useUnidadesMedida(enabled = true): UseUnidadesMedidaResult {
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    setLoading(true);
    setError(null);

    getUnidadesMedida()
      .then((data) => {
        if (active) setUnidades(data);
      })
      .catch((err) => {
        if (active)
          setError(`${err}--Error al cargar las unidades de medida.3`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return { unidades, loading, error };
}
