import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadService } from "../services/upload.services";

const useUploadMutations = (productId?: number, categoryId?: number) => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["product"] });
  };

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ["category"] });
  };

  const productUploadMutation = useMutation({
    mutationFn: (file: File) => uploadService.product.upload(productId!, file),
    onSuccess: invalidateProducts,
  });

  const productDeleteMutation = useMutation({
    mutationFn: () => uploadService.product.delete(productId!),
    onSuccess: invalidateProducts,
  });

  const categoryUploadMutation = useMutation({
    mutationFn: (file: File) => uploadService.category.upload(categoryId!, file),
    onSuccess: invalidateCategories,
  });

  const categoryDeleteMutation = useMutation({
    mutationFn: () => uploadService.category.delete(categoryId!),
    onSuccess: invalidateCategories,
  });

  return {
    uploadProductImage: productUploadMutation.mutateAsync,
    deleteProductImage: productDeleteMutation.mutateAsync,
    isUploadingProduct: productUploadMutation.isPending,
    isDeletingProduct: productDeleteMutation.isPending,

    uploadCategoryImage: categoryUploadMutation.mutateAsync,
    deleteCategoryImage: categoryDeleteMutation.mutateAsync,
    isUploadingCategory: categoryUploadMutation.isPending,
    isDeletingCategory: categoryDeleteMutation.isPending,
  };
};

export default useUploadMutations;
