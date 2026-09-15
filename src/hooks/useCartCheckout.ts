import { useState } from "react";
import type { CartItem, PaymentMethod, Sale } from "../types";
import { roundCurrency } from "../utils/format";

export function useCartCheckout(
  cart: CartItem[],
  onCheckout: (sale: Omit<Sale, "id">) => Promise<void>,
) {
  const [payMethod, setPayMethod] = useState<PaymentMethod>("Efectivo");
  const [amountPaid, setAmountPaid] = useState("");
  const [success, setSuccess] = useState(false);

  const subtotal = roundCurrency(
    cart.reduce((a, i) => a + i.product.salePrice * i.qty, 0),
  );
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

  return {
    payMethod,
    setPayMethod,
    amountPaid,
    setAmountPaid,
    success,
    subtotal,
    total,
    change,
    canCheckout,
    handleCheckout,
  };
}
