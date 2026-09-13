export interface VentaDetalleSave {
  id_producto: number;
  cantidad: number;
  subtotal: number;
}

export interface VentaSave {
  total: number;
  detalle: VentaDetalleSave[];
}
