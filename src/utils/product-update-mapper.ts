import type { Product } from "../types";
import type {
  ProductDraft,
  ProductUpdate,
  ProductUpdateBase,
} from "../types/product-update";

export function mapProductUpdate(
  product: Product,
  draft: ProductDraft,
): ProductUpdate {
  const payload: ProductUpdateBase = {
    id_producto: product.id_producto ?? product.id,
    nombre: draft.name,
    codigo_barras: draft.barcode,
    sku: draft.barcode,
  };

  const priceChanged =
    product.id_unidad !== draft.id_unidad ||
    product.purchasePrice !== draft.purchasePrice ||
    product.salePrice !== draft.salePrice ||
    product.profitMargin !== draft.profitMargin;

  if (!priceChanged) return payload;

  if (draft.id_unidad === undefined) {
    throw new Error("La unidad de medida es obligatoria");
  }

  return {
    ...payload,
    precio: {
      id_unidad: draft.id_unidad,
      precio_compra: draft.purchasePrice,
      porcentaje_ganancia: draft.profitMargin,
      precio_venta: draft.salePrice,
    },
  };
}
