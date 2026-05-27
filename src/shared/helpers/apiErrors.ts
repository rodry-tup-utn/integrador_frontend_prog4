import type { AxiosError } from "axios";

interface FastAPIValidationError {
  type: string;
  loc: string[];
  msg: string;
  input: unknown;
  ctx?: Record<string, unknown>;
}

interface FastAPIErrorResponse {
  detail: string | FastAPIValidationError[];
}

interface CustomErrorResponse {
  message: string;
}

type ApiError = AxiosError<FastAPIErrorResponse | CustomErrorResponse | string>;

export const extractApiErrorMessage = (error: unknown): string => {
  const axiosError = error as ApiError;

  if (!axiosError.response) {
    return axiosError.message || "Error de conexión o sin respuesta del servidor";
  }

  const { data } = axiosError.response;

  if (!data) {
    return `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => String(item)).join("; ");
  }

  const fastApiData = data as FastAPIErrorResponse;
  const customData = data as CustomErrorResponse;

  if (Array.isArray(fastApiData.detail)) {
    const messages = fastApiData.detail.map((err: FastAPIValidationError) => {
      const fieldName = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : null;
      const message = err.msg || String(err);

      return fieldName ? `${fieldName}: ${message}` : message;
    });

    return messages.join("; ");
  }

  if (typeof fastApiData.detail === "string" && fastApiData.detail.length > 0) {
    return fastApiData.detail;
  }

  if (typeof customData.message === "string" && customData.message.length > 0) {
    return customData.message;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return `Error ${axiosError.response.status}`;
  }
};
