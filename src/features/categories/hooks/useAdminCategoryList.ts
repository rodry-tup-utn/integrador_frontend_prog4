import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const useAdminCategoryList = (offset = 0, limit = 20, search = "") => {
  return useQuery({
    queryKey: categoryKeys.adminList({ offset, limit, search }),
    queryFn: () =>
      search
        ? categoryService.admin.search(search, offset, limit)
        : categoryService.admin.getAll(offset, limit),
  });
};
