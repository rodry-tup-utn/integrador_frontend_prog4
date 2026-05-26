import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";
import type { IngredientFilters } from "../types/ingredient";

export const useAdminIngredientsList = (filters: IngredientFilters = {}) => {
  return useQuery({
    queryKey: ingredientsKeys.adminList(filters),
    queryFn: () => ingredientService.admin.list(filters),
  });
};
