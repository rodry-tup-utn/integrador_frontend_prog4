import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { orderKeys } from "../../types/order";

export const useAdminOrderDetail = (id: number | null) => {
  return useQuery({
    queryKey: orderKeys.adminDetail(id!),
    queryFn: () => {
      if (!id)
        throw new Error(
          "Es necesario un id para acceder a los detalles de la orden",
        );
      return orderService.order.getById(id);
    },
    enabled: !!id,
  });
};
