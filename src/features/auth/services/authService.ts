import api from "../api/axiosConfig";
import type { AuthResponse, UserPrivateResponse } from "../types/auth";

export const authService = {
  login: async (formData: FormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  },

  getMe: async () => {
    const response = await api.get<UserPrivateResponse>("profile/me");
    return response.data;
  },
};
