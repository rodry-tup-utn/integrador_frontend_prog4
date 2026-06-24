import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.services";
import type { ProductIngredientBatchItem } from "../types/product";

export const useCalculateStock = (ingredients: ProductIngredientBatchItem[]) => {
  return useQuery({
    queryKey: ["product", "calculate-stock", ingredients],
    queryFn: () => productService.stock.calculateStock({ ingredients }),
    enabled: ingredients.length > 0,
  });
};
