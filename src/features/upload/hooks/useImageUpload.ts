import { useState } from "react";
import { uploadService } from "../services/upload.services";
import type { UploadResponse } from "../types/upload";

const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    try {
      return await uploadService.image.upload(file);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (publicId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await uploadService.image.delete(publicId);
    } finally {
      setIsDeleting(false);
    }
  };

  return { uploadImage, deleteImage, isUploading, isDeleting };
};

export default useImageUpload;
