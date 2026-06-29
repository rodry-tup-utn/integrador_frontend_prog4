import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.services";
import type {
  ProductCreate,
  ProductUpdate,
  ProductIngredientBatchCreate,
  ProductIngredient,
} from "../types/product";
import { productKeys } from "../types/product";

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  };

  const mutationCreate = useMutation({
    mutationFn: (data: ProductCreate) => productService.admin.create(data),
    onSuccess: invalidate,
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) =>
      productService.stock.update(id, data),
    onSuccess: invalidate,
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => productService.admin.delete(id),
    onSuccess: invalidate,
  });

  const mutationRestore = useMutation({
    mutationFn: (id: number) => productService.admin.restore(id),
    onSuccess: invalidate,
  });

  const mutationUpdateStock = useMutation({
    mutationFn: ({ id, stock }: { id: number; stock: number }) =>
      productService.stock.updateStock(id, stock),
    onSuccess: invalidate,
  });

  const mutationAvailability = useMutation({
    mutationFn: ({ id, is_available }: { id: number; is_available: boolean }) =>
      productService.stock.setAvailability(id, is_available),
    onSuccess: invalidate,
  });

  const mutationAddIngredientBatch = useMutation({
    mutationFn: ({
      product_id,
      data,
    }: {
      product_id: number;
      data: ProductIngredientBatchCreate;
    }) => productService.stock.addIngredientBatch(product_id, data),
    onSuccess: invalidate,
  });

  const mutationAddIngredient = useMutation({
    mutationFn: ({
      productId,
      ingredientId,
      data,
    }: {
      productId: number;
      ingredientId: number;
      data: ProductIngredient;
    }) => productService.stock.addIngredient(productId, ingredientId, data),
    onSuccess: invalidate,
  });

  const mutationUpdateIngredient = useMutation({
    mutationFn: ({
      productId,
      ingredientId,
      data,
    }: {
      productId: number;
      ingredientId: number;
      data: ProductIngredient;
    }) => productService.stock.updateIngredient(productId, ingredientId, data),
    onSuccess: invalidate,
  });

  const mutationDeleteIngredient = useMutation({
    mutationFn: ({
      productId,
      ingredientId,
    }: {
      productId: number;
      ingredientId: number;
    }) => productService.stock.removeIngredient(productId, ingredientId),
    onSuccess: invalidate,
  });

  const mutationUpdateIngredientsBatch = useMutation({
    mutationFn: ({
      product_id,
      data,
    }: {
      product_id: number;
      data: ProductIngredientBatchCreate;
    }) => productService.stock.updateIngredients(product_id, data),
    onSuccess: invalidate,
  });

  return {
    // product
    createProduct: mutationCreate.mutateAsync,
    updateProduct: mutationUpdate.mutateAsync,
    deleteProduct: mutationDelete.mutateAsync,
    restoreProduct: mutationRestore.mutateAsync,

    // Stock
    updateStock: mutationUpdateStock.mutateAsync,
    changeStockAvailable: mutationAvailability.mutateAsync,

    // product-ingredient
    addIngredientsBatch: mutationAddIngredientBatch.mutateAsync,
    addIngredient: mutationAddIngredient.mutateAsync,
    updateProductIngredient: mutationUpdateIngredient.mutateAsync,
    removeIngredient: mutationDeleteIngredient.mutateAsync,
    updateIngredientsBatch: mutationUpdateIngredientsBatch.mutateAsync,

    // statuses
    isCreating:
      mutationCreate.isPending ||
      mutationAddIngredientBatch.isPending ||
      mutationAddIngredient.isPending,
    isUpdating:
      mutationUpdate.isPending ||
      mutationUpdateStock.isPending ||
      mutationAvailability.isPending ||
      mutationUpdateIngredient.isPending ||
      mutationUpdateIngredientsBatch.isPending,
    isDeleting: mutationDelete.isPending || mutationDeleteIngredient.isPending,
    isRestoring: mutationRestore.isPending,
  };
};
