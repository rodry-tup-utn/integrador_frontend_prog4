import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";

export const useAdminIngredientsList = (
  offset = 0,
  limit = 20,
  search = "",
) => {
  return useQuery({
    queryKey: ingredientsKeys.adminList({ offset, limit, search }),
    queryFn: () =>
      search
        ? ingredientService.admin.search(search, offset, limit)
        : ingredientService.admin.getAll(offset, limit),
  });
};
