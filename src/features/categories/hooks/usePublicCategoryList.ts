import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryServices";
import { categoryKeys } from "../types/category";

export const usePublicCategoryList = (offset = 0, limit = 20, search = "") => {
  return useQuery({
    queryKey: categoryKeys.publicList({ offset, limit, search }),
    queryFn: () =>
      search
        ? categoryService.public.search(search, offset, limit)
        : categoryService.public.getAll(offset, limit),
  });
};
