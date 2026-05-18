import api from "../../../shared/api/axiosConfig";
import type { MeResponse } from "../types/auth";

export const authService = {
  login: async (formData: FormData): Promise<void> => {
    await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>("profile/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
