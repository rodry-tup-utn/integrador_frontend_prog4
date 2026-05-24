import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";

export const usePublicIngredientsList = (
  offset = 0,
  limit = 20,
  search = "",
) => {
  return useQuery({
    queryKey: ingredientsKeys.publicList({ offset, limit, search }),
    queryFn: () =>
      search
        ? ingredientService.public.search(search, offset, limit)
        : ingredientService.public.getAll(offset, limit),
  });
};
