import type { PaymentMethod } from "../../types";
import { fmt } from "../../utils/format";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Card from "../atoms/Card";
import { Icons } from "../atoms/Icon";

interface CartSummaryCardProps {
  cartLength: number;
  subtotal: number;
  total: number;
  payMethod: PaymentMethod;
  setPayMethod: (method: PaymentMethod) => void;
  amountPaid: string;
  setAmountPaid: (value: string) => void;
  change: number;
  canCheckout: boolean;
  success: boolean;
  loading: boolean;
  onCheckout: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "Efectivo",
  "Tarjeta",
  "Transferencia",
];

export default function CartSummaryCard({
  cartLength,
  subtotal,
  total,
  payMethod,
  setPayMethod,
  amountPaid,
  setAmountPaid,
  change,
  canCheckout,
  success,
  loading,
  onCheckout,
}: CartSummaryCardProps) {
  const paid = parseFloat(amountPaid) || 0;

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "14px 18px",
        gap: 10,
        height: "fit-content",
      }}
    >
      {/* Subtotal / Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "var(--muted-foreground)",
        }}
      >
        <span>Subtotal</span>
        <span style={{ fontFamily: "var(--font-mono)" }}>{fmt(subtotal)}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 15,
          fontWeight: 700,
          paddingTop: 4,
          borderTop: "1px solid var(--border)",
        }}
      >
        <span style={{ fontFamily: "var(--font-display)" }}>Total</span>
        <span
          style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}
        >
          {fmt(total)}
        </span>
      </div>

      {/* Payment method */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--muted-foreground)",
            marginBottom: 6,
          }}
        >
          Método de pago
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {PAYMENT_METHODS.map((m) => (
            <Button
              key={m}
              variant="secondary"
              size="sm"
              onClick={() => setPayMethod(m)}
              aria-pressed={payMethod === m}
              style={{
                flex: 1,
                padding: "6px 0",
                fontSize: 11,
                borderColor:
                  payMethod === m ? "var(--primary)" : "var(--border)",
                background: payMethod === m ? "#EEF2FF" : "white",
                color:
                  payMethod === m
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
              }}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>

      {/* Amount paid (only for cash) */}
      {payMethod === "Efectivo" && (
        <Input
          label="Cantidad recibida"
          type="number"
          min={0}
          step={0.5}
          placeholder={fmt(total)}
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          prefix={<span style={{ fontSize: 13 }}>$</span>}
          fullWidth
        />
      )}

      {/* Change */}
      {payMethod === "Efectivo" && paid > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: 8,
            background: change >= 0 ? "#ECFDF5" : "#FEF2F2",
            border: `1.5px solid ${change >= 0 ? "#6EE7B7" : "#FECACA"}`,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: change >= 0 ? "#059669" : "#EF4444",
            }}
          >
            Cambio
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 15,
              fontWeight: 700,
              color: change >= 0 ? "#059669" : "#EF4444",
            }}
          >
            {fmt(change)}
          </span>
        </div>
      )}

      {/* Checkout button */}
      {success ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px",
            background: "#ECFDF5",
            border: "1.5px solid #6EE7B7",
            borderRadius: 10,
            color: "#059669",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <Icons.check size={16} />
          Venta registrada
        </div>
      ) : (
        <Button
          onClick={onCheckout}
          disabled={!canCheckout || loading}
          fullWidth
          size="lg"
          style={{ fontFamily: "var(--font-display)", borderRadius: 10 }}
        >
          {loading
            ? "Registrando venta..."
            : `Cobrar ${cartLength > 0 ? fmt(total) : ""}`}
        </Button>
      )}
    </Card>
  );
}
