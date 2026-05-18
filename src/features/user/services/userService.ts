import api from "../../../shared/api/axiosConfig";

import type {
  UserBase,
  UserCreate,
  UserCreateByAdmin,
  UserDetail,
  UserList,
  UserPrivate,
  UserProfile,
  UserUpdate,
  AddressCreate,
  AddressRead,
  AddressUpdate,
} from "../types/user";

const ADMIN_URL = "/admin/user";
const PUBLIC_URL = "/user";
const PROFILE_URL = "/profile";

export const userService = {
  public: {
    create: async (data: UserCreate): Promise<UserBase> => {
      const response = await api.post<UserBase>(`${PUBLIC_URL}`, data);
      return response.data;
    },
  },

  profile: {
    me: async (): Promise<UserProfile> => {
      const response = await api.get<UserProfile>(`${PROFILE_URL}/me`);
      return response.data;
    },

    update: async (data: UserUpdate): Promise<UserPrivate> => {
      const response = await api.patch<UserPrivate>(
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
    getAll: async (offset = 0, limit = 20): Promise<UserList> => {
      const response = await api.get<UserList>(`${ADMIN_URL}`, {
        params: { offset, limit },
      });

      return response.data;
    },

    search: async (
      query: string,
      offset = 0,
      limit = 20,
    ): Promise<UserList> => {
      const response = await api.get<UserList>(`${ADMIN_URL}/search`, {
        params: { query, offset, limit },
      });
      return response.data;
    },

    getById: async (id: number): Promise<UserDetail> => {
      const response = await api.get<UserDetail>(`${ADMIN_URL}/${id}`);
      return response.data;
    },

    create: async (data: UserCreateByAdmin): Promise<UserBase> => {
      const response = await api.post<UserBase>(`${ADMIN_URL}`, data);
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

    restore: async (id: number): Promise<UserBase> => {
      const response = await api.patch<UserBase>(`${ADMIN_URL}/restore/${id}`);

      return response.data;
    },
  },
};
