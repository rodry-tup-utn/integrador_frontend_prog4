import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const useCategoryPath = (categoryId: number | null | undefined) => {
  return useQuery({
    queryKey: categoryKeys.publicPath(categoryId || 0),
    queryFn: () => categoryService.public.getPath(categoryId!),
    enabled: !!categoryId,
  });
};