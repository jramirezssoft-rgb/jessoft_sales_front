import { http } from "../lib/http";
import type { UnidadMedida } from "../types/unidad-medida";

export async function getUnidadesMedida(): Promise<UnidadMedida[]> {
  const { data } = await http.get<UnidadMedida[]>("/unidadesMedida");
  return data;
}
