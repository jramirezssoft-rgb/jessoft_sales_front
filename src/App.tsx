import { useState } from "react";
import type { Page, Product, Sale } from "./types";
import { INITIAL_PRODUCTS, INITIAL_SALES } from "./data";
import Sidebar from "./components/organisms/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import ProductsPage from "./components/pages/ProductsPage";
import SalesPage from "./components/pages/SalesPage";
import ReportsPage from "./components/pages/ReportsPage";
import { Icons } from "./components/atoms/Icon";
import { ToastProvider } from "./lib/Toast";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [nextSaleId, setNextSaleId] = useState(INITIAL_SALES.length + 1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (p: Page) => {
    setPage(p);
    setSidebarOpen(false);
  };

  //ESTE ES UN COMENTARIO DE PRUEBA

  const handleSale = (sale: Omit<Sale, "id">) => {
    setSales((ss) => [...ss, { ...sale, id: nextSaleId }]);
    setNextSaleId((n) => n + 1);
  };

  return (
    <>
      <ToastProvider />
      <div className="app-shell">
        {/* Sidebar drawer overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`app-sidebar${sidebarOpen ? " open" : ""}`}>
          <Sidebar page={page} onNav={handleNav} />
        </div>

        <main className="app-main">
          {page === "dashboard" && (
            <Dashboard products={products} sales={sales} />
          )}
          {page === "products" && <ProductsPage />}
          {page === "sales" && <SalesPage onSale={handleSale} />}
          {page === "reports" && (
            <ReportsPage sales={sales} products={products} />
          )}
        </main>

        {/* Mobile menu button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Menú"
        >
          {sidebarOpen ? <Icons.x size={22} /> : <Icons.menu size={22} />}
        </button>
      </div>
    </>
  );
}
