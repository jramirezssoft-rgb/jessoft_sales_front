import type { CartItem } from "../../types";
import CartItemRow from "../molecules/CartItemRow";
import Card from "../atoms/Card";

interface CartItemsCardProps {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
}

export default function CartItemsCard({
  cart,
  onUpdateQty,
}: CartItemsCardProps) {
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 0,
        overflow: "hidden",
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
    </Card>
  );
}
