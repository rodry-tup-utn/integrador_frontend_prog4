import { useQuery } from "@tanstack/react-query";
import { productKeys, type ProductFilters } from "../types/product";
import { productService } from "../services/product.services";

export const usePublicProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.public.getAll(filters),
  });
};

export const usePublicProductDetail = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.public.getById(id),
  });
};

export const useAdminProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productKeys.adminAll(filters),
    queryFn: () => productService.admin.getAllAdmin(filters),
  });
};

export const useAdminProductDetail = (id: number) => {
  return useQuery({
    queryKey: productKeys.getWithCategory(id),
    queryFn: () => productService.admin.getWithCategory(id),
  });
};

export const useProductWithIngredients = (id: number) => {
  return useQuery({
    queryKey: productKeys.getWithIngredients(id),
    queryFn: () => productService.productIngredient.getProductWithIngredients(id),
  });
};
