import api from "../../../shared/api/axiosConfig";
import type {
  ProductCreate,
  ProductDetail,
  ProductIngredient,
  ProductIngredientBatchCreate,
  ProductIngredientPublic,
  ProductFilters,
  ProductList,
  ProductPrivate,
  ProductPrivateList,
  ProductPublic,
  ProductUpdate,
  ProductWithIngredients,
} from "../types/product";

const ADMIN_URL = "/admin/product";
const PUBLIC_URL = "/product";
const STOCK_URL = "/stock/product";

export const productService = {
  public: {
    getAll: async (filters: ProductFilters = {}): Promise<ProductList> => {
      const response = await api.get<ProductList>(PUBLIC_URL, {
        params: filters,
      });
      return response.data;
    },

    getById: async (id: number): Promise<ProductPublic> => {
      const response = await api.get<ProductPublic>(`${PUBLIC_URL}/${id}`);
      return response.data;
    },
  },
  admin: {
    create: async (data: ProductCreate): Promise<ProductPrivate> => {
      const response = await api.post<ProductPrivate>(`${ADMIN_URL}`, data);
      return response.data;
    },

    update: async (id: number, data: ProductUpdate): Promise<ProductUpdate> => {
      const response = await api.patch<ProductUpdate>(
        `${ADMIN_URL}/${id}`,
        data,
      );
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`${ADMIN_URL}/${id}`);
    },

    restore: async (id: number): Promise<ProductPublic> => {
      const response = await api.patch(`${ADMIN_URL}/${id}/restore`);
      return response.data;
    },
  },
  stock: {
    getAllStock: async (
      filters: ProductFilters = {},
    ): Promise<ProductPrivateList> => {
      const response = await api.get<ProductPrivateList>(STOCK_URL, {
        params: filters,
      });
      return response.data;
    },
    getWithCategory: async (id: number): Promise<ProductDetail> => {
      const response = await api.get<ProductDetail>(`${STOCK_URL}/${id}`);
      return response.data;
    },
    updateStock: async (id: number, stock: number): Promise<ProductUpdate> => {
      const response = await api.patch<ProductUpdate>(
        `${STOCK_URL}/${id}/update`,
        {
          stock: stock,
        },
      );
      return response.data;
    },
    setAvailability: async (
      id: number,
      is_available: boolean,
    ): Promise<ProductPublic> => {
      const response = await api.patch<ProductPublic>(
        `${STOCK_URL}/${id}/available`,
        { available: is_available },
      );
      return response.data;
    },
  },
  productIngredient: {
    getProductWithIngredients: async (
      id: number,
    ): Promise<ProductWithIngredients> => {
      const response = await api.get<ProductWithIngredients>(
        `/product/${id}/ingredient`,
      );
      return response.data;
    },

    addIngredientBatch: async (
      id: number,
      data: ProductIngredientBatchCreate,
    ): Promise<ProductWithIngredients> => {
      const response = await api.post<ProductWithIngredients>(
        `/product/${id}/ingredient/batch`,
        data,
      );
      return response.data;
    },

    addIngredient: async (
      product_id: number,
      ingredient_id: number,
      data: ProductIngredient,
    ): Promise<ProductIngredientPublic> => {
      const response = await api.post<ProductIngredientPublic>(
        `/product/${product_id}/ingredient/${ingredient_id}`,
        data,
      );
      return response.data;
    },

    updateIngredient: async (
      product_id: number,
      ingredient_id: number,
      data: ProductIngredient,
    ): Promise<ProductIngredientPublic> => {
      const response = await api.patch(
        `/product/${product_id}/ingredient/${ingredient_id}`,
        data,
      );
      return response.data;
    },

    removeIngredient: async (
      product_id: number,
      ingredient_id: number,
    ): Promise<void> => {
      await api.delete(`/product/${product_id}/ingredient/${ingredient_id}`);
    },
  },
};
