import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys, type IngredientUpdate } from "../types/ingredient";

export const useIngredientMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ingredientsKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: ingredientService.admin.create,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: ingredientService.admin.delete,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientUpdate }) =>
      ingredientService.admin.update(id, data),
    onSuccess: invalidate,
  });

  const restoreMutation = useMutation({
    mutationFn: ingredientService.admin.restore,
    onSuccess: invalidate,
  });

  return {
    createIngredient: createMutation.mutateAsync,
    deleteIngredient: deleteMutation.mutateAsync,
    updateIngredient: updateMutation.mutateAsync,
    restoreIngredient: restoreMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRestoring: restoreMutation.isPending,
  };
};
