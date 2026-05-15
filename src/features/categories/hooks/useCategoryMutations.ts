import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryKeys, type CategoryUpdate } from "../types/category";
import { categoryService } from "../services/categoryServices";

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: categoryService.admin.create,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.admin.delete,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      categoryService.admin.update(id, data),
    onSuccess: invalidate,
  });

  const restoreMutation = useMutation({
    mutationFn: categoryService.admin.restore,
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
