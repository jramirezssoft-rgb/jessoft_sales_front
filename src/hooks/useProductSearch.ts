import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../types";
import { searchProductos } from "../services/productos-guardar";
import { mapProductoBuscado } from "../utils/product-search-mapper";

const SEARCH_DELAY = 300;

interface UseProductSearchResult {
  results: Product[];
  loading: boolean;
  error: string | null;
}

export function useProductSearch(query: string): UseProductSearchResult {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const products = await searchProductos(term, controller.signal);
        setResults(products.map(mapProductoBuscado));
      } catch (err) {
        if (!axios.isCancel(err)) {
          setResults([]);
          setError("No fue posible buscar productos");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return { results, loading, error };
}
