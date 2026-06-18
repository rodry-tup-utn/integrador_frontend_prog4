import api from "../../../shared/api/axiosConfig";
import type {
  OrderAdminList,
  OrderCancelByStaff,
  OrderCreate,
  OrderDetailPublic,
  OrderFilters,
  OrderList,
  OrderPublic,
  OrderStateChange,
} from "../types/order";

const CLIENT_URL = "/order";
const ADMIN_URL = "/admin/order";
const ORDER_URL = "/orders/order";

export const orderService = {
  client: {
    create: async (data: OrderCreate): Promise<OrderPublic> => {
      const response = await api.post<OrderPublic>(`${CLIENT_URL}/`, data);
      return response.data;
    },

    list: async (filters: OrderFilters): Promise<OrderList> => {
      const response = await api.get<OrderList>(`${CLIENT_URL}/`, {
        params: filters,
      });
      return response.data;
    },

    getById: async (id: number): Promise<OrderDetailPublic> => {
      const response = await api.get<OrderDetailPublic>(`${CLIENT_URL}/${id}`);
      return response.data;
    },

    cancel: async (id: number): Promise<void> => {
      await api.post(`${CLIENT_URL}/${id}/cancel`);
    },

    confirm: async (id: number): Promise<OrderDetailPublic> => {
      const response = await api.patch<OrderDetailPublic>(`${CLIENT_URL}/${id}/confirm`);
      return response.data;
    },
  },

  order: {
    list: async (filters: OrderFilters): Promise<OrderAdminList> => {
      const response = await api.get<OrderAdminList>(`${ORDER_URL}/`, {
        params: filters,
      });
      return response.data;
    },

    getById: async (id: number): Promise<OrderDetailPublic> => {
      const response = await api.get<OrderDetailPublic>(`${ORDER_URL}/${id}`);
      return response.data;
    },

    changeState: async (
      id: number,
      data: OrderStateChange,
    ): Promise<OrderDetailPublic> => {
      const response = await api.patch<OrderDetailPublic>(
        `${ORDER_URL}/${id}/state`,
        data,
      );
      return response.data;
    },

    cancelByStaff: async (
      id: number,
      data: OrderCancelByStaff,
    ): Promise<void> => {
      await api.post(`${ORDER_URL}/${id}/cancel`, data);
    },
  },
  admin: {
    softDelete: async (id: number): Promise<void> => {
      await api.delete(`${ADMIN_URL}/${id}/delete`);
    },
  },
};
