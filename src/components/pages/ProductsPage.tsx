import { useEffect, useState } from "react";
import type { Product } from "../../types";
import Button from "../atoms/Button";
import { Icons } from "../atoms/Icon";
import SearchBar from "../molecules/SearchBar";
import ProductTable from "../organisms/ProductTable";
import ProductForm from "../organisms/ProductForm";
import Pagination from "../molecules/Pagination";
import { useUnidadesMedida } from "../../hooks/useUnidadesMedida";
import { useProductos } from "../../hooks/useProductos";
import { useProductSearch } from "../../hooks/useProductSearch";
import { notify } from "../../lib/Toast";
import type { ProductDraft } from "../../types/product-update";
import { mapProductUpdate } from "../../utils/product-update-mapper";

type ModalState = { open: false } | { open: true; product: Product | null };

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false });
  const {
    unidades,
    loading: unidadesLoading,
    error: unidadesError,
  } = useUnidadesMedida();
  const {
    productos: remoteProducts,
    loading: productsLoading,
    error: productsError,
    page,
    totalPages,
    setPage,
    saveProducto,
    updateProducto,
    reloadProductos,
  } = useProductos();
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useProductSearch(search);
  const isSearching = search.trim().length > 0;
  const displayedProducts = isSearching ? searchResults : remoteProducts;

  useEffect(() => {
    if (productsError) notify.error("No fue posible cargar los productos");
  }, [productsError]);

  useEffect(() => {
    if (searchError) notify.error(searchError);
  }, [searchError]);

  const closeModal = () => setModal({ open: false });

  const handleSave = async (data: ProductDraft) => {
    if (modal.open && modal.product) {
      try {
        await updateProducto(mapProductUpdate(modal.product, data));
        await reloadProductos();
        closeModal();
        notify.success("Producto actualizado correctamente");
      } catch {
        notify.error("No fue posible actualizar el producto");
      }
      return;
    }

    try {
      await saveProducto({
        nombre: data.name,
        codigo_barras: data.barcode,
        id_unidad: data.id_unidad as number,
        precio_compra: data.purchasePrice,
        precio_venta: data.salePrice,
        porcentaje_ganancia: data.profitMargin,
      });

      closeModal();
      notify.success("Producto guardado correctamente");
    } catch {
      notify.error("No fue posible guardar el producto");
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">
            {isSearching && searchLoading
              ? "Buscando productos..."
              : productsLoading
                ? "Cargando productos..."
                : `${displayedProducts.length} productos en catálogo`}
          </p>
        </div>
        <Button
          icon={<Icons.plus />}
          onClick={() => setModal({ open: true, product: null })}
        >
          Nuevo producto
        </Button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o código de barras..."
        />
      </div>

      <ProductTable
        products={displayedProducts}
        onEdit={(p) => setModal({ open: true, product: p })}
      />

      {!isSearching && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          disabled={productsLoading}
        />
      )}

      {modal.open && (
        <ProductForm
          product={modal.product}
          unidades={unidades}
          unidadesLoading={unidadesLoading}
          unidadesError={unidadesError}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
