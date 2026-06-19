import api from "../../../shared/api/axiosConfig";
import type { UploadResponse } from "../types/upload";

const UPLOAD_URL = "/upload";

export const uploadService = {
  image: {
    upload: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<UploadResponse>(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    delete: async (publicId: string): Promise<void> => {
      await api.delete(`${UPLOAD_URL}/${publicId}`);
    },
  },
};
