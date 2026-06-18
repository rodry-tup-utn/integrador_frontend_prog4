import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Interceptor: normaliza fechas a UTC ─────────────────────────────
api.interceptors.response.use((response) => {
  response.data = JSON.parse(
    JSON.stringify(response.data).replace(
      /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)"/g,
      (match) =>
        match.endsWith('Z"') || match.includes("+")
          ? match
          : match.slice(0, -1) + 'Z"',
    ),
  );
  return response;
});

// ── Interceptor: refresh automático en 401 ───────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url ?? "";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes("/auth/refresh") &&
      !url.includes("/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
