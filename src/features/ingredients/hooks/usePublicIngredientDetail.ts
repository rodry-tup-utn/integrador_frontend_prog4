import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";

export const usePublicIngredientDetail = (id: string | null) => {
  return useQuery({
    queryKey: ingredientsKeys.publicDetail(String(id)),
    queryFn: () => {
      if (!id)
        throw new Error(
          "Es necesario un id para obtener los detalles del ingrediente",
        );
      ingredientService.public.getById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
