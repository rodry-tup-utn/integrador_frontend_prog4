import { Button, FileInput, Group, Image, Modal, Stack, Text } from "@mantine/core";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import useUploadMutations from "../../features/upload/hooks/upload.mutation.hooks";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../shared/helpers/apiErrors";

type UploadType = "product" | "category";

interface UploadFileProps {
    open: boolean;
    handleClose: () => void;
    type: UploadType,
    id: number;
    currentImageUrl?: string | null | undefined;
}

const UploadFile = ({ open, handleClose, type, id, currentImageUrl }: UploadFileProps) => {

    const [file, setFile] = useState<File | null>(null);

    const {
        uploadProductImage, deleteProductImage, isUploadingProduct, isDeletingProduct,
        uploadCategoryImage, deleteCategoryImage, isUploadingCategory, isDeletingCategory,
    } = useUploadMutations(
        type === "product" ? id : undefined,
        type === "category" ? id : undefined,
    );

    const uploadImage = type === "product" ? uploadProductImage : uploadCategoryImage;
    const deleteImage = type === "product" ? deleteProductImage : deleteCategoryImage;
    const isUploading = type === "product" ? isUploadingProduct : isUploadingCategory;
    const isDeleting = type === "product" ? isDeletingProduct : isDeletingCategory;

    const handleUpload = async () => {
        if (!file) return;
        try {
            await uploadImage(file);
            setFile(null);
            notifications.show({
                title: "Imagen actualizada",
                message: "La imagen se subió correctamente",
                color: "green"
            })
            handleClose();
        } catch (error) {
            notifications.show({
                title: "Error",
                message: extractApiErrorMessage(error, "No se pudo subir la imagen"),
                color: "red"
            })
        }
    };

    const handleDelete = async () => {
        try {
            await deleteImage();
            notifications.show({
                title: "Imagen eliminada",
                message: "La imagen fue eliminada correctamente",
                color: "green"
            })
            handleClose();
        } catch (error) {
            notifications.show({
                title: "Error",
                message: extractApiErrorMessage(error, "No se pudo eliminar la imagen"),
                color: "red"
            })
        }
    };

    return (
        <Modal opened={open} size={"xl"} onClose={handleClose} title="Gestor de imágenes">
            <Stack gap="sm">
                {currentImageUrl ? (
                    <Stack gap="xs">
                        <Image
                            src={currentImageUrl}
                            alt="Imagen actual del producto"
                            h={"full"}
                            w="auto"
                            fit="contain"
                            radius="lg"
                            className="max-h-80 rounded-2xl"
                        />
                        <Button
                            variant="light"
                            color="red"
                            size="xs"
                            leftSection={<IconTrash size={14} />}
                            loading={isDeleting}
                            onClick={handleDelete}
                        >
                            Eliminar imagen
                        </Button>
                    </Stack>
                ) : (
                    <Text size="sm" c="dimmed">
                        Sin imagen
                    </Text>
                )}

                <FileInput
                    label="Nueva imagen"
                    placeholder="Seleccioná un archivo"
                    leftSection={<IconPhoto size={16} />}
                    accept="image/jpeg,image/png,image/webp"
                    value={file}
                    onChange={setFile}
                    clearable
                />

                <Group justify="flex-end">
                    <Button
                        size="xs"
                        leftSection={<IconUpload size={14} />}
                        disabled={!file}
                        loading={isUploading}
                        onClick={handleUpload}
                    >
                        Subir imagen
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}

export default UploadFile