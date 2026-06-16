import api from "../../../shared/api/axiosConfig";
import type {
  Ingresos,
  PedidoEstado,
  ProductoTop,
  Resumen,
  VentaPeriodo,
} from "../types/estadisticas";

const URL = "/admin/estadisticas";

export const estadisticasService = {
  resumen: async (): Promise<Resumen> => {
    const response = await api.get<Resumen>(`${URL}/resumen`);
    return response.data;
  },

  ventas: async (params?: {
    desde?: string;
    hasta?: string;
    agrupacion?: string;
  }): Promise<VentaPeriodo[]> => {
    const response = await api.get<VentaPeriodo[]>(`${URL}/ventas`, {
      params,
    });
    return response.data;
  },

  productosTop: async (limit = 5): Promise<ProductoTop[]> => {
    const response = await api.get<ProductoTop[]>(`${URL}/productos-top`, {
      params: { limit },
    });
    return response.data;
  },

  pedidosEstado: async (): Promise<PedidoEstado[]> => {
    const response = await api.get<PedidoEstado[]>(`${URL}/pedidos-estado`);
    return response.data;
  },

  ingresos: async (params?: {
    desde?: string;
    hasta?: string;
  }): Promise<Ingresos> => {
    const response = await api.get<Ingresos>(`${URL}/ingresos`, { params });
    return response.data;
  },
};
