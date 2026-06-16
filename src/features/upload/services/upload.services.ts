import api from "../../../shared/api/axiosConfig";
import type { UploadResponse } from "../types/upload";

const UPLOAD_URL = "/upload";

export const uploadService = {
  product: {
    upload: async (productId: number, file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<UploadResponse>(
        `${UPLOAD_URL}/product/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    delete: async (productId: number): Promise<void> => {
      await api.delete(`${UPLOAD_URL}/product/${productId}`);
    },
  },
  category: {
    upload: async (categoryId: number, file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<UploadResponse>(
        `${UPLOAD_URL}/category/${categoryId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    },
    delete: async (cateogryId: number): Promise<void> => {
      await api.delete(`${UPLOAD_URL}/category/${cateogryId}`);
    },
  },
};
