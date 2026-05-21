import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const useCategoryTree = (depth = 2) => {
  return useQuery({
    queryKey: categoryKeys.publicTree(),
    queryFn: () => categoryService.public.getTree(depth),
  });
};
