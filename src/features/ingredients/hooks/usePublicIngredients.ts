import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";

export const usePublicIngredients = (
  offset = 0,
  limit = 20,
  search = "",
  selectedId: string | null = null,
) => {
  const ingredientsQuery = useQuery({
    queryKey: ["ingredients", "public", { offset, limit, search }],
    queryFn: () =>
      search
        ? ingredientService.public.search(search, offset, limit)
        : ingredientService.public.getAll(offset, limit),
  });

  const singleIngredientQuery = useQuery({
    queryKey: ["ingredients", "public", "detail", selectedId],
    queryFn: () => ingredientService.public.getById(selectedId!),
    enabled: !!selectedId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ingredients: ingredientsQuery.data,
    isLoading: ingredientsQuery.isLoading,
    ingredientDetail: singleIngredientQuery.data,
    isloadingDetail: singleIngredientQuery.isLoading,
  };
};
