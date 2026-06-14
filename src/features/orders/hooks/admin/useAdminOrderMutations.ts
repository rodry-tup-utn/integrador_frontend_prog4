import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import {
  orderKeys,
  type OrderCancelByStaff,
  type OrderStateChange,
} from "../../types/order";

export const useAdminOrderMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
  };

  const changeStateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderStateChange }) =>
      orderService.order.changeState(id, data),
    onSuccess: invalidate,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderCancelByStaff }) =>
      orderService.order.cancelByStaff(id, data),
    onSuccess: invalidate,
  });

  return {
    changeOrderState: changeStateMutation.mutateAsync,
    cancelOrderByStaff: cancelMutation.mutateAsync,
    isChangingState: changeStateMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
};
