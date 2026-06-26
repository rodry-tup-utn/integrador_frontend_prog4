import { useQueries } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { orderKeys, type OrderFilters } from "../types/order";

const KITCHEN_STATES = ["CONFIRMED", "IN_PREP"] as const;

export function useKitchenOrders() {
  const results = useQueries({
    queries: KITCHEN_STATES.map((state) => ({
      queryKey: orderKeys.adminList({
        state_code: state,
        limit: 50,
      } as OrderFilters),
      queryFn: () =>
        orderService.order.list({
          state_code: state,
          limit: 50,
        } as OrderFilters),
      refetchInterval: 60_000,
    })),
  });

  return KITCHEN_STATES.map((state, i) => ({
    state,
    orders: results[i].data?.data ?? [],
    isLoading: results[i].isLoading,
  }));
}
