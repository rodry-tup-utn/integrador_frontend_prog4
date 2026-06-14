import api from "../../../shared/api/axiosConfig";
import type {
  IngredientCreate,
  IngredientFilters,
  IngredientList,
  IngredientPrivate,
  IngredientPublic,
  IngredientsListFull,
  IngredientUpdate,
  UpdateStockIngredient,
} from "../types/ingredient";

const ADMIN_URL = "/admin/ingredient";
const PUBLIC_URL = "/ingredient";

const buildParams = (filters: IngredientFilters) => ({
  ...filters,
  search: filters.search || undefined,
  is_allergen: filters.is_allergen ?? undefined,
});

export const ingredientService = {
  public: {
    list: async (filters: IngredientFilters = {}): Promise<IngredientList> => {
      const response = await api.get<IngredientList>(PUBLIC_URL, {
        params: buildParams(filters),
      });
      return response.data;
    },

    getById: async (id: string): Promise<IngredientPublic> => {
      const response = await api.get<IngredientPublic>(`${PUBLIC_URL}/${id}`);
      return response.data;
    },
  },

  admin: {
    list: async (
      filters: IngredientFilters = {},
    ): Promise<IngredientsListFull> => {
      const response = await api.get<IngredientsListFull>(ADMIN_URL, {
        params: buildParams(filters),
      });
      return response.data;
    },

    getById: async (id: string): Promise<IngredientPrivate> => {
      const response = await api.get<IngredientPrivate>(`${ADMIN_URL}/${id}`);
      return response.data;
    },

    create: async (data: IngredientCreate): Promise<IngredientPublic> => {
      const response = await api.post<IngredientPublic>(ADMIN_URL, data);
      return response.data;
    },

    update: async (
      id: number,
      data: IngredientUpdate,
    ): Promise<IngredientPrivate> => {
      const response = await api.patch<IngredientPrivate>(
        `${ADMIN_URL}/${id}`,
        data,
      );
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`${ADMIN_URL}/${id}`);
    },

    restore: async (id: number): Promise<IngredientPrivate> => {
      const response = await api.patch<IngredientPrivate>(
        `${ADMIN_URL}/${id}/restore`,
      );
      return response.data;
    },

    updateStock: async (id: number, data: UpdateStockIngredient) => {
      const response = await api.patch<IngredientPrivate>(
        `${ADMIN_URL}/${id}/stock`,
        data,
      );
      return response.data;
    },
  },
};
