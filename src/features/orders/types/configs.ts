import type { OrderStateCode } from "./order";

export const STATE_COLORS: Record<OrderStateCode, string> = {
  PENDING: "yellow",
  CONFIRMED: "blue",
  IN_PREP: "violet",
  DELIVERED: "green",
  CANCELLED: "red",
};

export const STATE_LABELS: Record<OrderStateCode, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  IN_PREP: "En preparación",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const NEXT_STATE: Record<OrderStateCode, OrderStateCode | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "IN_PREP",
  IN_PREP: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};
export const nextState = (code: OrderStateCode): OrderStateCode | null =>
  NEXT_STATE[code];
export const stateLabel = (code: OrderStateCode): string => STATE_LABELS[code];
