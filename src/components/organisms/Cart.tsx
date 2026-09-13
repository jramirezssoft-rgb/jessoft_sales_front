import { useState } from "react";
import type { CartItem, PaymentMethod, Sale } from "../../types";
import { fmt } from "../../utils/format";
import CartItemRow from "../molecules/CartItemRow";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Card from "../atoms/Card";
import { Icons } from "../atoms/Icon";

interface CartProps {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
  onCheckout: (sale: Omit<Sale, "id">) => Promise<void>;
  loading: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "Efectivo",
  "Tarjeta",
  "Transferencia",
];

export default function Cart({
  cart,
  onUpdateQty,
  onCheckout,
  loading,
}: CartProps) {
  const [payMethod, setPayMethod] = useState<PaymentMethod>("Efectivo");
  const [amountPaid, setAmountPaid] = useState("");
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((a, i) => a + i.product.salePrice * i.qty, 0);
  const total = subtotal;
  const paid = parseFloat(amountPaid) || 0;
  const change = Math.max(0, paid - total);
  const canCheckout =
    cart.length > 0 && (payMethod !== "Efectivo" || paid >= total);

  const handleCheckout = async () => {
    if (!canCheckout) return;
    try {
      await onCheckout({
        date: new Date(),
        items: cart,
        subtotal,
        total,
        paymentMethod: payMethod,
        amountPaid: paid,
        change,
      });
      setSuccess(true);
      setAmountPaid("");
      setTimeout(() => setSuccess(false), 2500);
    } catch {}
  };

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 0,
        overflow: "hidden",
        height: "fit-content",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Carrito
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            marginTop: 2,
          }}
        >
          {cart.length === 0
            ? "Sin productos"
            : `${cart.reduce((a, i) => a + i.qty, 0)} artículos`}
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          overflowY: "auto",
          padding: "10px 16px",
          maxHeight: 320,
          minHeight: 80,
        }}
      >
        {cart.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--muted-foreground)",
              fontSize: 13,
              padding: "30px 0",
            }}
          >
            Busca y agrega productos
          </div>
        ) : (
          cart.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onUpdateQty={onUpdateQty}
            />
          ))
        )}
      </div>

      {/* Summary + checkout */}
      <div
        style={{
          padding: "14px 18px",
          borderTop: "1px solid var(--border)",
          background: "var(--muted)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
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
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {fmt(subtotal)}
          </span>
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
            onClick={handleCheckout}
            disabled={!canCheckout || loading}
            fullWidth
            size="lg"
            style={{ fontFamily: "var(--font-display)", borderRadius: 10 }}
          >
            {loading
              ? "Registrando venta..."
              : `Cobrar ${cart.length > 0 ? fmt(total) : ""}`}
          </Button>
        )}
      </div>
    </Card>
  );
}
