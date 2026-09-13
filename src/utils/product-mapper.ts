import type { Product } from "../types";
import type { ProductSummary } from "../types/product-summary";

export function mapProductSummary(product: ProductSummary): Product {
  return {
    id: product.id_producto,
    id_producto: product.id_producto,
    maxId: product.maxId,
    name: product.nombre,
    barcode: product.codigo_barras,
    sku: product.sku,
    id_unidad: product.id_unidad,
    tipo_unidad: product.tipo_unidad,
    abreviatura: product.abreviatura,
    purchasePrice: Number(product.precio_compra),
    salePrice: Number(product.precio_venta),
    profitMargin: Number(product.porcentaje_ganancia),
  };
}
