import type { Product } from "../types";

const MEASURED_UNIT_IDS = [1, 3];

export function isMeasuredProduct(product: Product): boolean {
  const unit = product.tipo_unidad.trim().toLowerCase();
  return (
    MEASURED_UNIT_IDS.includes(product.id_unidad) ||
    unit === "kilogramo" ||
    unit === "metro"
  );
}

export function getMinimumQuantity(product: Product): number {
  return isMeasuredProduct(product) ? 0.001 : 1;
}
