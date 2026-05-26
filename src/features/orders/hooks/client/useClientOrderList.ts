import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { orderKeys, type OrderClientFilters } from "../../types/order";

export const useClientOrderList = (filters: OrderClientFilters = {}) => {
  return useQuery({
    queryKey: orderKeys.clientList(filters),
    queryFn: () => orderService.client.list(filters),
  });
};
