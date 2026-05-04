import api from "../api/axiosConfig";
import type {
  IngredientCreate,
  IngredientList,
  IngredientPrivate,
  IngredientPublic,
  IngredientUpdate,
} from "../features/ingredients/types/ingredient";

const ADMIN_URL = "/admin/ingredient";
const PUBLIC_URL = "/ingredient";
export const ingredientService = {
  // -- Métodos Públicos ----------------------------------

  public: {
    getAll: async (offset = 0, limit = 20): Promise<IngredientList> => {
      const response = await api.get<IngredientList>(`${PUBLIC_URL}`, {
        params: { offset, limit },
      });
      return response.data;
    },

    getById: async (id: number): Promise<IngredientPublic> => {
      const response = await api.get<IngredientPublic>(`${PUBLIC_URL}/${id}`);
      return response.data;
    },

    search: async (
      query: string,
      offset = 0,
      limit = 20,
    ): Promise<IngredientList> => {
      const response = await api.get<IngredientList>(`${PUBLIC_URL}/search`, {
        params: { query, offset, limit },
      });
      return response.data;
    },
  },

  // -- Métodos Administrativos ----------------------

  admin: {
    getAll: async (offset = 0, limit = 20): Promise<IngredientList> => {
      const response = await api.get<IngredientList>(`${ADMIN_URL}`, {
        params: { offset, limit },
      });
      return response.data;
    },

    getById: async (id: number): Promise<IngredientPrivate> => {
      const response = await api.get<IngredientPrivate>(`${ADMIN_URL}/${id}`);
      return response.data;
    },

    create: async (data: IngredientCreate): Promise<IngredientPublic> => {
      const response = await api.post<IngredientPublic>(`${ADMIN_URL}`, data);
      return response.data;
    },

    update: async (
      id: number,
      data: IngredientUpdate,
    ): Promise<IngredientPrivate> => {
      const response = await api.patch<IngredientPrivate>(
        `${ADMIN_URL}${id}`,
        data,
      );
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`${ADMIN_URL}${id}`);
    },

    restore: async (id: number): Promise<IngredientPrivate> => {
      const response = await api.patch<IngredientPrivate>(
        `${ADMIN_URL}${id}/restore`,
      );
      return response.data;
    },

    search: async (
      query: string,
      offset = 0,
      limit = 20,
    ): Promise<IngredientList> => {
      const response = await api.get<IngredientList>(`${ADMIN_URL}/search`, {
        params: { query, offset, limit },
      });
      return response.data;
    },
  },
};
