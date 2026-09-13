import type { Product } from "../types";
import type { ProductoBuscado } from "../types/product-search";

export function mapProductoBuscado(producto: ProductoBuscado): Product {
  return {
    id: producto.id_producto,
    id_producto: producto.id_producto,
    name: producto.nombre,
    barcode: producto.codigo_barras,
    sku: producto.sku,
    id_unidad: producto.precio.id_unidad,
    tipo_unidad: producto.precio.unidad.nombre,
    abreviatura: producto.precio.unidad.abreviatura,
    purchasePrice: Number(producto.precio.precio_compra),
    salePrice: Number(producto.precio.precio_venta ?? 0),
    profitMargin: Number(producto.precio.porcentaje_ganancia ?? 0),
  };
}
