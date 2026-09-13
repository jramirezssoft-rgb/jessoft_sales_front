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

export default function ProductMeasurementModal({
  product,
  onConfirm,
  onCancel,
}: ProductMeasurementModalProps) {
  const [quantity, setQuantity] = useState("");
  const parsedQuantity = Number(quantity);
  const hasValidQuantity =
    Number.isFinite(parsedQuantity) && parsedQuantity >= 0.001;
  const subtotal = hasValidQuantity ? product.salePrice * parsedQuantity : 0;
  const unit = product.abreviatura || product.tipo_unidad;

  const footer = (
    <div style={{ display: "flex", gap: 10 }}>
      <Button variant="secondary" onClick={onCancel} fullWidth>
        Cancelar
      </Button>
      <Button
        onClick={() => hasValidQuantity && onConfirm(parsedQuantity)}
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

        <Input
          label={`Cantidad a vender (${unit})`}
          type="number"
          min={0.001}
          step={0.001}
          placeholder="Ej. 0.001"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          fullWidth
          autoFocus
        />

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
