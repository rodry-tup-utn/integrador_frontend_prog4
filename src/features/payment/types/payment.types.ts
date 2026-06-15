export interface PaymentPublic {
  id: number;
  order_id: number;
  mp_payment_id?: number | null;
  mp_status?: string | null;
  mp_status_detail?: string | null;
  transaction_amount: string | number;
  payment_method_id?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CheckoutPreferenceResponse {
  payment_id: number;
  preference_id: string;
  init_point: string;
  sandbox_init_point: string;
}

export const paymentKeys = {
  all: ["payments"] as const,
  byOrderId: (orderId: number) => [...paymentKeys.all, "order", orderId] as const,
};
