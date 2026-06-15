import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/payment.services";
import { paymentKeys } from "../types/payment.types";

const usePaymentMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: paymentKeys.all });
  };

  const mutationCreate = useMutation({
    mutationFn: (orderId: number) => paymentService.client.createPreference(orderId),
    onSuccess: invalidate,
  });

  return {
    createCheckout: mutationCreate.mutateAsync,
    isCreating: mutationCreate.isPending,
  };
};

export default usePaymentMutation;
