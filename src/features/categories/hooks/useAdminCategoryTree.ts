import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const useAdminCategoryTree = (depth = 10) => {
  return useQuery({
    queryKey: categoryKeys.adminTree(depth),
    queryFn: () => categoryService.admin.getTree(depth),
  });
};
