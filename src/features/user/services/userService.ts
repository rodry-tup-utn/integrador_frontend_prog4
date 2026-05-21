import api from "../../../shared/api/axiosConfig";

import type {
  UserCreate,
  UserCreateByAdmin,
  UserUpdate,
  AddressCreate,
  AddressRead,
  AddressUpdate,
  UserResponse,
  UserProfileRead,
  UserPaginatedRead,
  UserDetailRead,
} from "../types/user";

const ADMIN_URL = "/admin/user";
const PUBLIC_URL = "/user";
const PROFILE_URL = "/profile";

export const userService = {
  public: {
    create: async (data: UserCreate): Promise<UserResponse> => {
      const response = await api.post<UserResponse>(`${PUBLIC_URL}`, data);
      return response.data;
    },
  },

  profile: {
    me: async (): Promise<UserProfileRead> => {
      const response = await api.get<UserProfileRead>(`${PROFILE_URL}/me`);
      return response.data;
    },

    update: async (data: UserUpdate): Promise<UserResponse> => {
      const response = await api.patch<UserResponse>(
        `${PROFILE_URL}/update`,
        data,
      );
      return response.data;
    },

    addresses: {
      getAll: async (): Promise<AddressRead[]> => {
        const response = await api.get<AddressRead[]>(`${PROFILE_URL}/address`);
        return response.data;
      },

      create: async (data: AddressCreate): Promise<AddressRead> => {
        const response = await api.post<AddressRead>(
          `${PROFILE_URL}/address`,
          data,
        );
        return response.data;
      },

      update: async (id: number, data: AddressUpdate): Promise<AddressRead> => {
        const response = await api.patch<AddressRead>(
          `${PROFILE_URL}/address/${id}`,
          data,
        );
        return response.data;
      },

      delete: async (id: number): Promise<void> => {
        await api.delete(`${PROFILE_URL}/address/${id}`);
      },

      restore: async (id: number): Promise<AddressRead> => {
        const response = await api.patch<AddressRead>(
          `${PROFILE_URL}/address/${id}/restore`,
        );
        return response.data;
      },
    },
  },

  admin: {
    getAll: async (offset = 0, limit = 20): Promise<UserPaginatedRead> => {
      const response = await api.get<UserPaginatedRead>(`${ADMIN_URL}`, {
        params: { offset, limit },
      });

      return response.data;
    },

    search: async (
      query: string,
      offset = 0,
      limit = 20,
    ): Promise<UserPaginatedRead> => {
      const response = await api.get<UserPaginatedRead>(`${ADMIN_URL}/search`, {
        params: { query, offset, limit },
      });
      return response.data;
    },

    getById: async (id: number): Promise<UserDetailRead> => {
      const response = await api.get<UserDetailRead>(`${ADMIN_URL}/${id}`);
      return response.data;
    },

    create: async (data: UserCreateByAdmin): Promise<UserResponse> => {
      const response = await api.post<UserResponse>(`${ADMIN_URL}`, data);
      return response.data;
    },

    assignRole: async (
      id: number,
      roleCode: string,
    ): Promise<{ message: string }> => {
      const response = await api.post<{ message: string }>(
        `${ADMIN_URL}/${id}/role/${roleCode}`,
      );

      return response.data;
    },

    revokeRole: async (
      id: number,
      roleCode: string,
    ): Promise<{ message: string }> => {
      const response = await api.delete<{ message: string }>(
        `${ADMIN_URL}/${id}/role/${roleCode}`,
      );

      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`${ADMIN_URL}/${id}`);
    },

    restore: async (id: number): Promise<UserResponse> => {
      const response = await api.patch<UserResponse>(
        `${ADMIN_URL}/restore/${id}`,
      );

      return response.data;
    },
  },
};
