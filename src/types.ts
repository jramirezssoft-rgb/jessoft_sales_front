export interface Product {
  id: number;
  id_producto?: number;
  maxId?: number;
  name: string;
  barcode: string;
  sku?: string;
  id_unidad: number;
  tipo_unidad: string;
  abreviatura: string;
  purchasePrice: number;
  salePrice: number;
  profitMargin: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type PaymentMethod = "Efectivo" | "Tarjeta" | "Transferencia";

export interface Sale {
  id: number;
  date: Date;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
}

export type Page = "dashboard" | "products" | "sales" | "reports";
