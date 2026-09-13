import { useState } from "react";
import type { Product } from "../../types";
import type { UnidadMedida } from "../../types/unidad-medida";
import {
  hasProductChanges,
  type ProductDraft,
} from "../../types/product-update";
import { calcMargin, calcSaleFromMargin } from "../../utils/format";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";

interface ProductFormProps {
  product?: Product | null;
  unidades: UnidadMedida[];
  unidadesLoading: boolean;
  unidadesError: string | null;
  onSave: (data: ProductDraft) => Promise<void>;
  onClose: () => void;
}

export default function ProductForm({
  product,
  unidades,
  unidadesLoading,
  unidadesError,
  onSave,
  onClose,
}: ProductFormProps) {
  const isEdit = !!product?.id;

  const [form, setForm] = useState<ProductDraft>({
    name: product?.name ?? "",
    barcode: product?.barcode ?? "",
    id_unidad: product?.id_unidad,
    purchasePrice: product?.purchasePrice ?? 0,
    salePrice: product?.salePrice ?? 0,
    profitMargin: product?.profitMargin ?? 0,
  });

  const update = (field: keyof ProductDraft, raw: string) => {
    const num = parseFloat(raw) || 0;
    setForm((prev) => {
      if (field === "purchasePrice") {
        return {
          ...prev,
          purchasePrice: num,
          profitMargin: calcMargin(num, prev.salePrice),
        };
      }
      if (field === "salePrice") {
        return {
          ...prev,
          salePrice: num,
          profitMargin: calcMargin(prev.purchasePrice, num),
        };
      }
      if (field === "profitMargin") {
        return {
          ...prev,
          profitMargin: num,
          salePrice: calcSaleFromMargin(prev.purchasePrice, num),
        };
      }
      return { ...prev, [field]: raw };
    });
  };

  const hasValidUnit = unidades.some(
    (unidad) => unidad.id_unidad === form.id_unidad,
  );
  const errors = {
    name:
      form.name.trim().length === 0 ? "El nombre es obligatorio" : undefined,
    barcode:
      form.barcode.trim().length === 0
        ? "El código de barras es obligatorio"
        : undefined,
    unit: !hasValidUnit ? "Selecciona una unidad de medida" : undefined,
    purchasePrice:
      form.purchasePrice <= 0
        ? "El precio de compra es obligatorio"
        : undefined,
    salePrice:
      form.salePrice <= 0 ? "El precio de reventa es obligatorio" : undefined,
    profitMargin:
      form.profitMargin <= 0 ? "La ganancia es obligatoria" : undefined,
  };
  const valid = Object.values(errors).every((error) => !error);
  const hasChanges = !isEdit || hasProductChanges(product, form);

  const footer = (
    <div style={{ display: "flex", gap: 10 }}>
      <Button variant="secondary" onClick={onClose} fullWidth>
        Cancelar
      </Button>
      <Button
        onClick={() => valid && onSave(form)}
        disabled={!valid || !hasChanges}
        fullWidth
        style={{ flex: 2 }}
      >
        {isEdit ? "Guardar cambios" : "Agregar producto"}
      </Button>
    </div>
  );

  return (
    <Modal
      title={isEdit ? "Editar Producto" : "Nuevo Producto"}
      onClose={onClose}
      footer={footer}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input
          label="Nombre del producto"
          placeholder="Ej. Coca-Cola 600ml"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          fullWidth
        />
        <Input
          label="Código de barras"
          placeholder="7501055300891"
          value={form.barcode}
          error={errors.barcode}
          onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
          fullWidth
        />

        <Select
          label="Unidad de medida"
          value={form.id_unidad ?? ""}
          error={errors.unit}
          disabled={unidadesLoading || unidades.length === 0}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              id_unidad: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          fullWidth
        >
          <option value="">
            {unidadesLoading
              ? "Cargando unidades..."
              : unidades.length === 0
                ? "No hay unidades disponibles"
                : "Selecciona una unidad"}
          </option>
          {!unidadesLoading &&
            unidades.map((unidad) => (
              <option key={unidad.id_unidad} value={unidad.id_unidad}>
                {unidad.nombre}{" "}
                {unidad.abreviatura ? `(${unidad.abreviatura})` : ""}
              </option>
            ))}
        </Select>
        {unidadesError && (
          <span style={{ fontSize: 12, color: "#EF4444" }}>
            {unidadesError}
          </span>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          <Input
            label="Precio de compra"
            type="number"
            min={0}
            step={0.5}
            placeholder="0.00"
            value={form.purchasePrice || ""}
            error={errors.purchasePrice}
            onChange={(e) => update("purchasePrice", e.target.value)}
            prefix={<span style={{ fontSize: 13 }}>$</span>}
          />
          <Input
            label="Precio de reventa"
            type="number"
            min={0}
            step={0.5}
            placeholder="0.00"
            value={form.salePrice || ""}
            error={errors.salePrice}
            onChange={(e) => update("salePrice", e.target.value)}
            prefix={<span style={{ fontSize: 13 }}>$</span>}
          />
          <Input
            label="% Ganancia"
            type="number"
            min={0}
            step={0.1}
            placeholder="0"
            value={form.profitMargin || ""}
            error={errors.profitMargin}
            onChange={(e) => update("profitMargin", e.target.value)}
            suffix={<span style={{ fontSize: 13 }}>%</span>}
          />
        </div>
      </div>
    </Modal>
  );
}
