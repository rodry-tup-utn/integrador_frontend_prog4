export interface Resumen {
  total_ordenes: number;
  total_ingresos: number;
  promedio_orden: number | null;
  total_usuarios: number;
  ordenes_por_estado: Record<string, number>;
}

export interface VentaPeriodo {
  periodo: string;
  total: number;
  cantidad_pedidos: number;
}

export interface ProductoTop {
  producto_id: number;
  nombre: string;
  cantidad_vendida: number;
  ingresos_totales: number;
}

export interface PedidoEstado {
  estado: string;
  descripcion: string | null;
  cantidad: number;
}

export interface FormaPagoIngreso {
  forma_pago: string;
  descripcion: string | null;
  total: number;
}

export interface Ingresos {
  total: number;
  por_forma_pago: FormaPagoIngreso[];
  desde: string | null;
  hasta: string | null;
}

export interface VentasFilters {
  desde?: string;
  hasta?: string;
  agrupacion?: string;
}

export const estadisticasKeys = {
  all: ["estadisticas"] as const,
  resumen: () => [...estadisticasKeys.all, "resumen"] as const,
  ventas: (filters?: VentasFilters) =>
    [...estadisticasKeys.all, "ventas", filters] as const,
  productosTop: (limit?: number) =>
    [...estadisticasKeys.all, "productos-top", limit] as const,
  pedidosEstado: () => [...estadisticasKeys.all, "pedidos-estado"] as const,
  ingresos: (filters?: { desde?: string; hasta?: string }) =>
    [...estadisticasKeys.all, "ingresos", filters] as const,
};
