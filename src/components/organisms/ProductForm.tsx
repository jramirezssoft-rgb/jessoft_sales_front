import { useState } from "react";
import type { Product } from "../../types";
import type { UnidadMedida } from "../../types/unidad-medida";
import {
  hasProductChanges,
  type ProductDraft,
} from "../../types/product-update";
import { calcMargin, calcSaleFromMargin, fmt } from "../../utils/format";
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

const LABEL_SIZE = 16;

const STEPS = [
  { key: "name", title: "Nombre del producto" },
  { key: "barcode", title: "Código de barras" },
  { key: "unit", title: "Unidad de medida" },
  { key: "pricing", title: "Precios" },
  { key: "summary", title: "Confirmar" },
] as const;

export default function ProductForm({
  product,
  unidades,
  unidadesLoading,
  unidadesError,
  onSave,
  onClose,
}: ProductFormProps) {
  const isEdit = !!product?.id;
  const [step, setStep] = useState(0);

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

  const selectedUnit = unidades.find(
    (unidad) => unidad.id_unidad === form.id_unidad,
  );
  const hasValidUnit = !!selectedUnit;
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

  const stepValid = {
    name: !errors.name,
    barcode: !errors.barcode,
    unit: !errors.unit,
    pricing: !errors.purchasePrice && !errors.salePrice && !errors.profitMargin,
    summary: valid,
  };
  const currentKey = STEPS[step].key;
  const canGoNext = stepValid[currentKey];
  const isLastStep = step === STEPS.length - 1;

  const goNext = () => {
    if (canGoNext && !isLastStep) setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const footer = (
    <div style={{ display: "flex", gap: 10 }}>
      <Button
        variant="secondary"
        onClick={step === 0 ? onClose : goBack}
        fullWidth
      >
        {step === 0 ? "Cancelar" : "Atrás"}
      </Button>
      {isLastStep ? (
        <Button
          onClick={() => valid && onSave(form)}
          disabled={!valid || !hasChanges}
          fullWidth
          style={{ flex: 2 }}
        >
          {isEdit ? "Guardar cambios" : "Agregar producto"}
        </Button>
      ) : (
        <Button
          onClick={goNext}
          disabled={!canGoNext}
          fullWidth
          style={{ flex: 2 }}
        >
          Siguiente
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      title={isEdit ? "Editar Producto" : "Nuevo Producto"}
      onClose={onClose}
      footer={footer}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: i < STEPS.length - 1 ? 1 : undefined,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                  background: i <= step ? "var(--primary)" : "var(--muted)",
                  color: i <= step ? "white" : "var(--muted-foreground)",
                  border: i <= step ? "none" : "1.5px solid var(--border)",
                }}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: i < step ? "var(--primary)" : "var(--border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {STEPS[step].title}
        </div>

        {/* Step: name */}
        {currentKey === "name" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Nombre del producto"
              labelSize={LABEL_SIZE}
              value={form.name}
              error={errors.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
              autoFocus
              style={{ fontSize: 16, padding: "12px 14px" }}
            />
          </div>
        )}

        {/* Step: barcode */}
        {currentKey === "barcode" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Código de barras"
              labelSize={LABEL_SIZE}
              value={form.barcode}
              error={errors.barcode}
              onChange={(e) =>
                setForm((f) => ({ ...f, barcode: e.target.value }))
              }
              fullWidth
              autoFocus
              style={{ fontSize: 16, padding: "12px 14px" }}
            />
          </div>
        )}

        {/* Step: unit */}
        {currentKey === "unit" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Select
              label="Unidad de medida"
              labelSize={LABEL_SIZE}
              value={form.id_unidad ?? ""}
              error={errors.unit}
              disabled={unidadesLoading || unidades.length === 0}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  id_unidad: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
              fullWidth
              style={{ fontSize: 16, padding: "12px 14px" }}
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
              <span style={{ fontSize: 13, color: "#EF4444" }}>
                {unidadesError}
              </span>
            )}
          </div>
        )}

        {/* Step: pricing */}
        {currentKey === "pricing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Precio de compra"
              labelSize={LABEL_SIZE}
              type="number"
              min={0}
              step={0.5}
              value={form.purchasePrice || ""}
              error={errors.purchasePrice}
              onChange={(e) => update("purchasePrice", e.target.value)}
              prefix={<span style={{ fontSize: 15 }}>$</span>}
              fullWidth
              style={{ fontSize: 16, padding: "12px 14px" }}
            />
            <Input
              label="Precio de reventa"
              labelSize={LABEL_SIZE}
              type="number"
              min={0}
              step={0.5}
              value={form.salePrice || ""}
              error={errors.salePrice}
              onChange={(e) => update("salePrice", e.target.value)}
              prefix={<span style={{ fontSize: 15 }}>$</span>}
              fullWidth
              style={{ fontSize: 16, padding: "12px 14px" }}
            />
            <Input
              label="% Ganancia"
              labelSize={LABEL_SIZE}
              type="number"
              min={0}
              step={0.1}
              value={form.profitMargin || ""}
              error={errors.profitMargin}
              onChange={(e) => update("profitMargin", e.target.value)}
              suffix={<span style={{ fontSize: 15 }}>%</span>}
              fullWidth
              style={{ fontSize: 16, padding: "12px 14px" }}
            />
          </div>
        )}

        {/* Step: summary */}
        {currentKey === "summary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Nombre", value: form.name },
              { label: "Código de barras", value: form.barcode },
              {
                label: "Unidad de medida",
                value: selectedUnit
                  ? `${selectedUnit.nombre}${
                      selectedUnit.abreviatura
                        ? ` (${selectedUnit.abreviatura})`
                        : ""
                    }`
                  : "—",
              },
              { label: "Precio de compra", value: fmt(form.purchasePrice) },
              { label: "Precio de reventa", value: fmt(form.salePrice) },
              { label: "% Ganancia", value: `${form.profitMargin}%` },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: LABEL_SIZE,
                    color: "var(--muted-foreground)",
                  }}
                >
                  {row.label}
                </span>
                <span style={{ fontSize: LABEL_SIZE, fontWeight: 700 }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
