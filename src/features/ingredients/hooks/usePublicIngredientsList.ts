import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";
import type { IngredientFilters } from "../types/ingredient";

export const usePublicIngredientsList = (filters: IngredientFilters = {}) => {
  return useQuery({
    queryKey: ingredientsKeys.publicList(filters),
    queryFn: () => ingredientService.public.list(filters),
  });
};
