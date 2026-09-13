import type { CartItem } from "../../types";
import { fmt } from "../../utils/format";
import { isMeasuredProduct } from "../../utils/product-measure";
import { Icons } from "../atoms/Icon";
import IconButton from "../atoms/IconButton";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (id: number, qty: number) => void;
}

export default function CartItemRow({ item, onUpdateQty }: CartItemRowProps) {
  const { product, qty } = item;
  const isMeasured = isMeasuredProduct(product);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "var(--foreground)",
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-mono)",
            marginTop: 1,
          }}
        >
          {fmt(product.salePrice)}
        </div>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}
      >
        <IconButton
          label={
            isMeasured || qty === 1 ? "Eliminar producto" : "Disminuir cantidad"
          }
          onClick={() => onUpdateQty(product.id, isMeasured ? 0 : qty - 1)}
          style={{ fontSize: 16, fontWeight: 700 }}
        >
          {qty === 1 ? <Icons.trash size={13} /> : "−"}
        </IconButton>
        <span
          style={{
            width: 26,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}
        >
          {isMeasured ? `${qty} ${product.abreviatura}` : qty}
        </span>
        {!isMeasured && (
          <IconButton
            label="Aumentar cantidad"
            onClick={() => onUpdateQty(product.id, qty + 1)}
            style={{ fontSize: 16, fontWeight: 700 }}
          >
            +
          </IconButton>
        )}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          minWidth: 65,
          textAlign: "right",
          color: "var(--primary)",
        }}
      >
        {fmt(product.salePrice * qty)}
      </div>
    </div>
  );
}
