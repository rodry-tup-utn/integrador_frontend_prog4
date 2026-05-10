import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import type { IngredientUpdate } from "../types/ingredient";

export const useIngredients = (offset = 0, limit = 20, search = "") => {
  const queryClient = useQueryClient();

  // --- 1. LECTURA (Query) ---
  const ingredientsQuery = useQuery({
    // La Query Key es sagrada: si el offset o search cambian, se refetchea solo
    queryKey: ["ingredients", "admin", { offset, limit, search }],
    queryFn: () =>
      search
        ? ingredientService.admin.search(search, offset, limit)
        : ingredientService.admin.getAll(offset, limit),
  });

  const createMutation = useMutation({
    mutationFn: ingredientService.admin.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ingredientService.admin.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientUpdate }) =>
      ingredientService.admin.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: ingredientService.admin.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  return {
    ingredients: ingredientsQuery.data,
    isLoading: ingredientsQuery.isLoading,
    isError: ingredientsQuery.isError,

    createIngredient: createMutation.mutateAsync,
    deleteIngredient: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    updateIngredient: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    restoreIngredient: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
  };
};
