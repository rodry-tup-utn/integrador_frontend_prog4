import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { orderKeys, type OrderCreate } from "../../types/order";

export const useClientOrderMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: (data: OrderCreate) => orderService.client.create(data),
    onSuccess: invalidate,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => orderService.client.cancel(id),
    onSuccess: invalidate,
  });

  return {
    createOrder: createMutation.mutateAsync,
    cancelOrder: cancelMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
};
