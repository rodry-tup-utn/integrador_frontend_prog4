import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { orderKeys } from "../../types/order";

export const useClientOrderDetail = (id: number | null) => {
  return useQuery({
    queryKey: orderKeys.clientDetail(id!),
    queryFn: () => {
      if (!id)
        throw new Error(
          "Es necesario un id para acceder a los detalles de la orden",
        );
      return orderService.client.getById(id);
    },
    enabled: !!id,
  });
};
