import api from "../../../shared/api/axiosConfig";
import type { CheckoutPreferenceResponse, PaymentPublic } from "../types/payment.types";

const PAYMENT_URL = "/payment";
const ADMIN_PAYMENT_URL = "/admin/payment";

export const paymentService = {
  client: {
    createPreference: async (orderId: number): Promise<CheckoutPreferenceResponse> => {
      const response = await api.post<CheckoutPreferenceResponse>(
        `${PAYMENT_URL}/checkout/${orderId}`,
      );
      return response.data;
    },
  },

  admin: {
    getByOrderId: async (orderId: number): Promise<PaymentPublic[]> => {
      const response = await api.get<PaymentPublic[]>(`${ADMIN_PAYMENT_URL}/order/${orderId}`);
      return response.data;
    },
  },
};
