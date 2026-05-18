import api from "../../../shared/api/axiosConfig";
import type {
  CategoryCreate,
  CategoryList,
  CategoryListPrivate,
  CategoryPrivate,
  CategoryPublic,
  CategoryUpdate,
} from "../types/category";

const ADMIN_URL = "/admin/category";
const PUBLIC_URL = "/category";
export const categoryService = {
  public: {
    getAll: async (offset = 0, limit = 20): Promise<CategoryList> => {
      const response = await api.get<CategoryList>(`${PUBLIC_URL}`, {
        params: { offset, limit },
      });
      return response.data;
    },

    getById: async (id: string): Promise<CategoryPrivate> => {
      const response = await api.get<CategoryPrivate>(`${PUBLIC_URL}/${id}`);
      return response.data;
    },

    search: async (
      query: string,
      offset = 0,
      limit = 20,
    ): Promise<CategoryList> => {
      const response = await api.get<CategoryListPrivate>(
        `${PUBLIC_URL}/search`,
        {
          params: { query, offset, limit },
        },
      );
      return response.data;
    },
  },

  admin: {
    getAll: async (offset = 0, limit = 20): Promise<CategoryListPrivate> => {
      const response = await api.get<CategoryListPrivate>(`${ADMIN_URL}`, {
        params: { offset, limit },
      });
      return response.data;
    },

    getById: async (id: string): Promise<CategoryPrivate> => {
      const response = await api.get<CategoryPrivate>(`${ADMIN_URL}/${id}`);
      return response.data;
    },

    create: async (data: CategoryCreate): Promise<CategoryPrivate> => {
      const response = await api.post<CategoryPrivate>(`${ADMIN_URL}`, data);
      return response.data;
    },

    update: async (
      id: number,
      data: CategoryUpdate,
    ): Promise<CategoryPrivate> => {
      const response = await api.patch<CategoryPrivate>(
        `${ADMIN_URL}/${id}`,
        data,
      );
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`${ADMIN_URL}/${id}`);
    },

    restore: async (id: number): Promise<CategoryPrivate> => {
      const response = await api.patch<CategoryPrivate>(
        `${ADMIN_URL}/${id}/restore`,
      );
      return response.data;
    },

    search: async (
      query: string,
      offset = 0,
      limit = 20,
    ): Promise<CategoryListPrivate> => {
      const response = await api.get<CategoryListPrivate>(
        `${ADMIN_URL}/search`,
        {
          params: { query, offset, limit },
        },
      );
      return response.data;
    },
  },
};
