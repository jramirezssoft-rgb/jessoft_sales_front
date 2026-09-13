export interface ProductoBuscado {
  id_producto: number;
  nombre: string;
  codigo_barras: string;
  sku: string;
  id_categoria: number;
  fecha_alta: string;
  precio: {
    id_precio: number;
    id_unidad: number;
    precio_compra: string;
    porcentaje_ganancia: string | null;
    precio_venta: string | null;
    fecha_inicio: string;
    fecha_fin: string | null;
    unidad: {
      nombre: string;
      abreviatura: string;
    };
  };
}
