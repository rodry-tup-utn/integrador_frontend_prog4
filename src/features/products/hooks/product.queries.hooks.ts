import { useQuery } from "@tanstack/react-query";
import { productKeys } from "../types/product";
import { productService } from "../services/product.services";

// queries publicas
export const usePublicProducts = (offset = 0, limit = 20) => {
  return useQuery({
    queryKey: productKeys.list(offset, limit),
    queryFn: () => productService.public.getAll(offset, limit),
  });
};

export const usePublicSearchProducts = (query: string, offset = 0, limit = 20) => {
  return useQuery({
    queryKey: productKeys.search(query, offset, limit),
    queryFn: () => productService.public.search(query, offset, limit),
  });
};

export const usePublicProductDetail = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.public.getById(id),
  });
};

export const useProductByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: productKeys.getByCategory(categoryId),
    queryFn: () => productService.public.getByCategory(categoryId),
  });
};

// queries de admin
export const useAdminProducts = (offset = 0, limit = 20) => {
  return useQuery({
    queryKey: productKeys.adminAll(offset, limit),
    queryFn: () => productService.admin.getAllAdmin(offset, limit),
  });
};

export const useAdminProductDetail = (id: number) => {
  return useQuery({
    queryKey: productKeys.getWithCategory(id),
    queryFn: () => productService.admin.getWithCategory(id),
  });
};

// queries de product-ingredient
export const useProductWithIngredients = (id: number) => {
  return useQuery({
    queryKey: productKeys.getWithIngredients(id),
    queryFn: () => productService.productIngredient.getProductWithIngredients(id),
  });
};
