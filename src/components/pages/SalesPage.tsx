import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { CartItem, Product, Sale } from "../../types";
import { useCartCheckout } from "../../hooks/useCartCheckout";
import { useProductSearch } from "../../hooks/useProductSearch";
import { useVentas } from "../../hooks/useVentas";
import { notify } from "../../lib/Toast";
import { searchProductos } from "../../services/productos-guardar";
import { fmt } from "../../utils/format";
import {
  getMinimumQuantity,
  isMeasuredProduct,
} from "../../utils/product-measure";
import { mapProductoBuscado } from "../../utils/product-search-mapper";
import Button from "../atoms/Button";
import SearchBar from "../molecules/SearchBar";
import CartItemsCard from "../organisms/CartItemsCard";
import CartSummaryCard from "../organisms/CartSummaryCard";
import ProductMeasurementModal from "../organisms/ProductMeasurementModal";

interface SalesPageProps {
  onSale: (sale: Omit<Sale, "id">) => void;
}

export default function SalesPage({ onSale }: SalesPageProps) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pendingMeasuredProduct, setPendingMeasuredProduct] =
    useState<Product | null>(null);
  const { results, loading, error } = useProductSearch(search);
  const { loading: savingSale, saveVenta } = useVentas();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = () => {
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  useEffect(() => {
    focusSearchInput();
  }, []);

  // Escucha global para redirigir la entrada del escáner o teclado al buscador
  // en caso de que el usuario haya hecho clic fuera del input
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (pendingMeasuredProduct) return;

      const activeEl = document.activeElement;
      const isInputActive =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement;

      if (
        !isInputActive &&
        (e.key.length === 1 || e.key === "Enter") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [pendingMeasuredProduct]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === product.id);
      if (existing)
        return c.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + quantity } : i,
        );
      return [...c, { product, qty: quantity }];
    });
    setSearch("");
    focusSearchInput();
  };

  const selectProduct = (product: Product) => {
    if (isMeasuredProduct(product)) {
      setPendingMeasuredProduct(product);
      return;
    }

    addToCart(product, 1);
  };

  const handleBarcodeSubmit = async (code: string) => {
    const query = code.trim();
    if (!query) return;

    // Limpiamos el texto de búsqueda para evitar que parpadeen sugerencias
    setSearch("");

    // Verificamos si ya está en los resultados cargados
    let target = results.find(
      (p) =>
        p.barcode?.toLowerCase() === query.toLowerCase() ||
        p.sku?.toLowerCase() === query.toLowerCase() ||
        p.name.toLowerCase() === query.toLowerCase(),
    );

    if (!target) {
      try {
        const response = await searchProductos(query);
        if (response && response.length > 0) {
          const mapped = response.map(mapProductoBuscado);
          const exact = mapped.find(
            (p) =>
              p.barcode?.toLowerCase() === query.toLowerCase() ||
              p.sku?.toLowerCase() === query.toLowerCase(),
          );
          target = exact || mapped[0];
        }
      } catch {
        notify.error("Error al buscar el producto");
        focusSearchInput();
        return;
      }
    }

    if (target) {
      selectProduct(target);
    } else {
      notify.error(`Producto con código "${query}" no encontrado`);
    }

    focusSearchInput();
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (search.trim()) {
        handleBarcodeSubmit(search);
      }
    }
  };

  const updateQty = (id: number, qty: number) => {
    setCart((currentCart) => {
      const item = currentCart.find((cartItem) => cartItem.product.id === id);
      if (!item || qty < getMinimumQuantity(item.product)) {
        return currentCart.filter((cartItem) => cartItem.product.id !== id);
      }

      return currentCart.map((cartItem) =>
        cartItem.product.id === id ? { ...cartItem, qty } : cartItem,
      );
    });
  };

  const handleSale = async (sale: Omit<Sale, "id">) => {
    try {
      await saveVenta({
        total: sale.total,
        detalle: sale.items.map(({ product, qty }) => ({
          id_producto: product.id,
          cantidad: qty,
          subtotal: product.salePrice * qty,
        })),
      });
      onSale(sale);
      setCart([]);
      focusSearchInput();
    } catch {
      notify.error("No fue posible registrar la venta");
      throw new Error("No fue posible registrar la venta");
    }
  };

  const {
    payMethod,
    setPayMethod,
    amountPaid,
    setAmountPaid,
    success,
    subtotal,
    total,
    change,
    canCheckout,
    handleCheckout,
  } = useCartCheckout(cart, handleSale);

  return (
    <div className="page-content">
      <div style={{ marginBottom: 22 }}>
        <h1 className="page-title">Nueva Venta</h1>
        <p className="page-subtitle">
          Busca productos por nombre o código de barras
        </p>
      </div>

      <div className="sales-layout">
        {/* Left: search + results + cart items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SearchBar
            inputRef={searchInputRef}
            autoFocus
            value={search}
            onChange={setSearch}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar producto o escanear código de barras..."
          />

          {/* Search results */}
          {results.length > 0 && (
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {results.map((p, i) => (
                <Button
                  key={p.id}
                  variant="ghost"
                  onClick={() => selectProduct(p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "auto",
                    padding: "12px 16px",
                    textAlign: "left",
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        marginTop: 2,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {p.barcode || "Sin código"}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      flexShrink: 0,
                      marginLeft: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        color: "var(--primary)",
                      }}
                    >
                      {fmt(p.salePrice)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        marginTop: 2,
                      }}
                    >
                      Toca para agregar
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {search.trim() && loading && (
            <div
              style={{
                textAlign: "center",
                color: "var(--muted-foreground)",
                fontSize: 14,
                padding: "30px 0",
              }}
            >
              Buscando productos...
            </div>
          )}

          {search.trim() && error && !loading && (
            <div
              style={{
                textAlign: "center",
                color: "#EF4444",
                fontSize: 14,
                padding: "30px 0",
              }}
            >
              {error}
            </div>
          )}

          {search.trim() && !loading && !error && results.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--muted-foreground)",
                fontSize: 14,
                padding: "30px 0",
              }}
            >
              No se encontraron productos con "{search}"
            </div>
          )}

          {!search.trim() && (
            <div
              style={{
                textAlign: "center",
                color: "var(--muted-foreground)",
                fontSize: 14,
                padding: "40px 0",
                opacity: 0.6,
              }}
            >
              Escribe para buscar un producto
            </div>
          )}

          <CartItemsCard cart={cart} onUpdateQty={updateQty} />
        </div>

        {/* Right: order summary + payment */}
        <CartSummaryCard
          cartLength={cart.length}
          subtotal={subtotal}
          total={total}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          amountPaid={amountPaid}
          setAmountPaid={setAmountPaid}
          change={change}
          canCheckout={canCheckout}
          success={success}
          loading={savingSale}
          onCheckout={handleCheckout}
        />
      </div>

      {pendingMeasuredProduct && (
        <ProductMeasurementModal
          product={pendingMeasuredProduct}
          onConfirm={(quantity) => {
            addToCart(pendingMeasuredProduct, quantity);
            setPendingMeasuredProduct(null);
            focusSearchInput();
          }}
          onCancel={() => {
            setPendingMeasuredProduct(null);
            focusSearchInput();
          }}
        />
      )}
    </div>
  );
}
