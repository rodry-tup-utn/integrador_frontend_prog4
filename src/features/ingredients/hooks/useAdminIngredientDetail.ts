import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";

export const useAdminIngredientDetail = (id: string | null) => {
  return useQuery({
    queryKey: ingredientsKeys.adminDetail(id),
    queryFn: () => {
      if (!id) throw new Error("No puede buscarse un ingrediente sin id");
      return ingredientService.admin.getById(id);
    },
    enabled: !!id,
  });
};
