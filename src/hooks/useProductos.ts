import { useCallback, useEffect, useState } from "react";
import {
  getProductos,
  saveProducto,
  updateProducto as updateProductoService,
} from "../services/productos-guardar";
import type { ProductSave } from "../types/product-save";
import type { ProductUpdate } from "../types/product-update";
import type { Product } from "../types";
import { mapProductSummary } from "../utils/product-mapper";

const DEFAULT_LIMIT = 10;

interface UseProductosResult {
  productos: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  data: ProductSave | null;
  saveProducto: (producto: ProductSave) => Promise<ProductSave>;
  updateProducto: (producto: ProductUpdate) => Promise<void>;
  reloadProductos: () => Promise<void>;
}

export function useProductos(): UseProductosResult {
  const [productos, setProductos] = useState<Product[]>([]);
  const [data, setData] = useState<ProductSave | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const reloadProductos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProductos(page, limit);
      setProductos(response.data.map(mapProductSummary));
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los productos",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    reloadProductos().catch(() => undefined);
  }, [reloadProductos]);

  const createProducto = async (
    producto: ProductSave,
  ): Promise<ProductSave> => {
    setLoading(true);
    setError(null);

    try {
      const savedProducto = await saveProducto(producto);
      setData(savedProducto);
      return savedProducto;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al guardar el producto";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProducto = async (producto: ProductUpdate): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await updateProductoService(producto);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el producto";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    setPage,
    data,
    saveProducto: createProducto,
    updateProducto,
    reloadProductos,
  };
}
