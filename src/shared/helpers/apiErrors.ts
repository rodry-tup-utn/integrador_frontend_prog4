import type { AxiosError } from "axios";

interface BackendErrorResponse {
  error: {
    code: string;
    message: string;
    request_id?: string;
    timestamp: string;
    fields?: Array<{ field: string; message: string; type: string }>;
  };
}

export const extractApiErrorMessage = (
  error: unknown,
  fallback: string = "Error de conexión o sin respuesta del servidor",
): string => {
  const axiosError = error as AxiosError<BackendErrorResponse>;

  if (!axiosError.response) {
    return axiosError.message || fallback;
  }

  const { data } = axiosError.response;

  if (!data) {
    return `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.error?.message) {
    return data.error.message;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return `Error ${axiosError.response.status}`;
  }
};
