import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const useAdminCategoryDetail = (id: string | null) => {
  return useQuery({
    queryKey: categoryKeys.adminDetail(String(id)),
    queryFn: () => {
      if (!id)
        throw new Error(
          "Es necesario un id para acceder a los detalles de la categoria",
        );
      return categoryService.admin.getById(id);
    },
    enabled: !!id,
  });
};
