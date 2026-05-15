import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const usePublicCategoryDetail = (id: string | null) => {
  return useQuery({
    queryKey: categoryKeys.publicDetail(String(id)),
    queryFn: () => {
      if (!id)
        throw new Error(
          "Es necesario un id para acceder a los detalles de la categoria",
        );
      categoryService.admin.getById(id);
    },
    enabled: !!id,
  });
};
