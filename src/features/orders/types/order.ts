export interface OrderItemCreate {
  product_id: number;
  quantity: number;
  personalization?: number[] | null;
}

export interface OrderItemPublic {
  product_id: number;
  quantity: number;
  name_snap: string;
  price_snap: string | number;
  subtotal_snap: string | number;
  personalization?: number[] | null;
}

export interface OrderCreate {
  address_id: number;
  payment_method_code: string;
  notes?: string | null;
  items: OrderItemCreate[];
  discount?: string | number | null;
  shipping_cost?: string | number | null;
}

export interface OrderUserPublic {
  id: number;
  name: string;
  lastname: string;
  email: string;
}

export interface OrderAddressPublic {
  id: number;
  alias: string;
  line_one: string;
  city: string;
  province: string;
}

export interface StateOrderPublic {
  code: string;
  description: string;
}

export interface OrderHistorialPublic {
  id: number;
  state_from_code?: string | null;
  state_to_code: string;
  reason?: string | null;
  created_at: string;
}

export interface OrderPublic {
  id: number;
  user_id: number;
  address_id: number;
  state_code: string;
  payment_method_code: string;
  subtotal: string | number;
  discount: string | number;
  shipping_cost: string | number;
  notes?: string | null;
  created_at: string;
}

export interface OrderAdmin extends OrderPublic {
  user: OrderUserPublic;
}

export interface OrderDetailPublic extends OrderPublic {
  user: OrderUserPublic;
  address: OrderAddressPublic;
  state: StateOrderPublic;
  items: OrderItemPublic[];
  historials: OrderHistorialPublic[];
}

export interface OrderList {
  data: OrderPublic[];
  total: number;
}

export interface OrderAdminList {
  data: OrderAdmin[];
  total: number;
}

export interface OrderStateChange {
  state_code: string;
  reason?: string | null;
}

export interface OrderCancelByStaff {
  reason: string;
}

export type OrderStateCode =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREP"
  | "DELIVERED"
  | "CANCELLED";

export type OrderSortBy = "created_at" | "subtotal" | "id";

export type OrderDirection = "asc" | "desc";

export interface OrderClientFilters {
  state_code?: OrderStateCode | null;
  date_from?: string | null;
  date_to?: string | null;
  offset?: number;
  limit?: number;
  sort_by?: OrderSortBy | null;
  order?: OrderDirection | null;
}

export interface OrderFilters extends OrderClientFilters {
  user_id?: number | null;
  user_email?: string | null;
  user_lastname?: string | null;
  user_name?: string | null;
}

// QueryFactory
export const orderKeys = {
  all: ["orders"] as const,
  client: () => [...orderKeys.all, "client"] as const,
  clientLists: () => [...orderKeys.client(), "list"] as const,
  clientList: (filters: OrderClientFilters) =>
    [...orderKeys.clientLists(), filters] as const,
  clientDetails: () => [...orderKeys.client(), "detail"] as const,
  clientDetail: (id: number) => [...orderKeys.clientDetails(), id] as const,

  admin: () => [...orderKeys.all, "admin"] as const,
  adminLists: () => [...orderKeys.admin(), "list"] as const,
  adminList: (filters: OrderFilters) =>
    [...orderKeys.adminLists(), filters] as const,
  adminDetails: () => [...orderKeys.admin(), "detail"] as const,
  adminDetail: (id: number) => [...orderKeys.adminDetails(), id] as const,
};
