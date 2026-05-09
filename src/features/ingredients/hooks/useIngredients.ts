import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { toast } from "sonner";
import type { IngredientUpdate } from "../types/ingredient";

export const useIngredients = (
  offset = 0,
  limit = 20,
  search = "",
  selectedId: string | null = null,
) => {
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

  const singleIngredientQuery = useQuery({
    queryKey: ["ingredients", "admin", "detail", selectedId],
    queryFn: () => ingredientService.admin.getById(selectedId!),
    enabled: !!selectedId, // <--- Solo se dispara si le pasás un ID
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: ingredientService.admin.create,
    onSuccess: (updatedData) => {
      toast.success(`Ingrediente ${updatedData.name} creado`);
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Error al crear");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ingredientService.admin.delete,
    onSuccess: () => {
      toast.success("Ingrediente eliminado");
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientUpdate }) =>
      ingredientService.admin.update(id, data),
    onSuccess: (updatedData) => {
      toast.success(`Ingrediente ${updatedData.name} actualizado`);
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "No se pudo actualizar el producto",
      );
    },
  });

  const restoreMutation = useMutation({
    mutationFn: ingredientService.admin.restore,
    onSuccess: (updatedData) => {
      toast.success(`Producto ${updatedData.name} restaurado correctamente`);
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      return updatedData;
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "No se pudo actualizar el producto",
      );
    },
  });

  return {
    ingredients: ingredientsQuery.data,
    isLoading: ingredientsQuery.isLoading,
    isError: ingredientsQuery.isError,
    ingredientDetail: singleIngredientQuery.data,
    isLoadingDetail: singleIngredientQuery.isLoading,

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
