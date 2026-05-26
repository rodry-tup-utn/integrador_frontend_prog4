import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { orderKeys, type OrderFilters } from "../../types/order";

export const useAdminOrderList = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: orderKeys.adminList(filters),
    queryFn: () => orderService.order.list(filters),
  });
};
