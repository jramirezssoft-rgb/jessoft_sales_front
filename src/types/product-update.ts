import type { Product } from "../types";

export interface ProductDraft {
  name: string;
  barcode: string;
  id_unidad: number | undefined;
  purchasePrice: number;
  salePrice: number;
  profitMargin: number;
}

export interface ProductUpdateBase {
  id_producto: number;
  nombre: string;
  codigo_barras: string;
  sku: string;
}

export interface ProductPriceUpdate {
  id_unidad: number;
  precio_compra: number;
  porcentaje_ganancia: number;
  precio_venta: number;
}

export interface ProductUpdateWithPrice extends ProductUpdateBase {
  precio: ProductPriceUpdate;
}

export type ProductUpdate = ProductUpdateBase | ProductUpdateWithPrice;

export function hasProductChanges(
  product: Product,
  draft: ProductDraft,
): boolean {
  return (
    product.name !== draft.name ||
    product.barcode !== draft.barcode ||
    product.id_unidad !== draft.id_unidad ||
    product.purchasePrice !== draft.purchasePrice ||
    product.salePrice !== draft.salePrice ||
    product.profitMargin !== draft.profitMargin
  );
}
