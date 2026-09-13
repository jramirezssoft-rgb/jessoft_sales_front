import type { AxiosRequestConfig } from "axios";
import { http } from "../lib/http";
import type { PaginatedResponse } from "../types/paginated-response";
import type { ProductSave } from "../types/product-save";
import type { ProductoBuscado } from "../types/product-search";
import type { ProductSummary } from "../types/product-summary";
import type { ProductUpdate } from "../types/product-update";

export async function getProductos(
  page: number,
  limit: number,
): Promise<PaginatedResponse<ProductSummary>> {
  const { data } = await http.get<PaginatedResponse<ProductSummary>>(
    "/productos",
    { params: { page, limit } },
  );
  return data;
}

export async function searchProductos(
  producto: string,
  signal?: AxiosRequestConfig["signal"],
): Promise<ProductoBuscado[]> {
  const { data } = await http.get<ProductoBuscado[]>("/productos/buscar", {
    params: { producto },
    signal,
  });
  return data;
}

export async function saveProducto(
  producto: ProductSave,
): Promise<ProductSave> {
  const { data } = await http.post<ProductSave>("/productos", producto);
  return data;
}

export async function updateProducto(producto: ProductUpdate): Promise<void> {
  await http.put("/productos", producto);
}
