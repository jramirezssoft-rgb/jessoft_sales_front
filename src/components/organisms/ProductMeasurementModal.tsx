import { useState } from "react";
import type { Product } from "../../types";
import { fmt } from "../../utils/format";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Text from "../atoms/Text";
import Modal from "../molecules/Modal";

interface ProductMeasurementModalProps {
  product: Product;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

type EntryMode = "weight" | "money";

export default function ProductMeasurementModal({
  product,
  onConfirm,
  onCancel,
}: ProductMeasurementModalProps) {
  const [mode, setMode] = useState<EntryMode>("weight");
  const [weightInput, setWeightInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const unit = product.abreviatura || product.tipo_unidad;

  const parsedWeight = Number(weightInput);
  const parsedAmount = Number(amountInput);

  const quantity =
    mode === "weight"
      ? parsedWeight
      : Number.isFinite(parsedAmount) && product.salePrice > 0
        ? parsedAmount / product.salePrice
        : 0;

  const hasValidQuantity = Number.isFinite(quantity) && quantity >= 0.001;
  const subtotal = hasValidQuantity ? product.salePrice * quantity : 0;

  const footer = (
    <div style={{ display: "flex", gap: 10 }}>
      <Button variant="secondary" onClick={onCancel} fullWidth>
        Cancelar
      </Button>
      <Button
        onClick={() => hasValidQuantity && onConfirm(quantity)}
        disabled={!hasValidQuantity}
        fullWidth
        style={{ flex: 2 }}
      >
        Agregar al carrito
      </Button>
    </div>
  );

  return (
    <Modal
      title={`Vender ${product.name}`}
      onClose={onCancel}
      dismissible={false}
      footer={footer}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
          <Text>Precio de venta: </Text>
          <Text as="strong" style={{ color: "var(--foreground)" }}>
            {fmt(product.salePrice)} por {unit}
          </Text>
        </div>

        <div style={{ display: "flex", gap: 5 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMode("weight")}
            aria-pressed={mode === "weight"}
            style={{
              flex: 1,
              padding: "6px 0",
              fontSize: 12,
              borderColor:
                mode === "weight" ? "var(--primary)" : "var(--border)",
              background: mode === "weight" ? "#EEF2FF" : "white",
              color:
                mode === "weight"
                  ? "var(--primary)"
                  : "var(--muted-foreground)",
            }}
          >
            Por báscula
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMode("money")}
            aria-pressed={mode === "money"}
            style={{
              flex: 1,
              padding: "6px 0",
              fontSize: 12,
              borderColor:
                mode === "money" ? "var(--primary)" : "var(--border)",
              background: mode === "money" ? "#EEF2FF" : "white",
              color:
                mode === "money" ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            Por dinero
          </Button>
        </div>

        {mode === "weight" ? (
          <Input
            label={`Cantidad a vender (${unit})`}
            type="number"
            min={0.001}
            step={0.001}
            placeholder="Ej. 0.001"
            value={weightInput}
            onChange={(event) => setWeightInput(event.target.value)}
            fullWidth
            autoFocus
          />
        ) : (
          <>
            <Input
              label="Monto a vender"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="Ej. 10"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              prefix={<span style={{ fontSize: 13 }}>$</span>}
              fullWidth
              autoFocus
            />
            <div
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
              <Text style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
                Peso a colocar en báscula
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: "var(--foreground)",
                }}
              >
                {hasValidQuantity ? `${quantity.toFixed(3)} ${unit}` : "—"}
              </Text>
            </div>
          </>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            borderRadius: 8,
            background: "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          <Text style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            Subtotal
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: "var(--primary)",
            }}
          >
            {fmt(subtotal)}
          </Text>
        </div>
      </div>
    </Modal>
  );
}
