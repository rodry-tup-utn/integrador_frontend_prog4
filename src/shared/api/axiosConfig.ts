import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// interceptor para formatear todas las fechas a UTC para evitar errores de zona horaria
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

export default api;
