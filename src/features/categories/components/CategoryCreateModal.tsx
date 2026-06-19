import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Text,
  Checkbox,
  Paper,
  Image,
  FileInput,
  ActionIcon,
} from "@mantine/core";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import type { CategoryCreate } from "../types/category";
import { CategorySelector } from "./CategorySelector";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import useImageUpload from "../../upload/hooks/useImageUpload";

interface Props {
  opened: boolean;
  onClose: () => void;
}

const initialState: CategoryCreate = {
  name: "",
  description: null,
  parent_id: undefined,
};

export const CategoryCreateModal = ({ opened, onClose }: Props) => {
  const { createCategory, isCreating } = useCategoryMutations();
  const { uploadImage, isUploading } = useImageUpload();
  const [formData, setFormData] = useState<CategoryCreate>(initialState);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (opened) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialState);
      setPreview(null);
    }
  }, [opened]);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const result = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: result.url }));
      setPreview(result.url);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractApiErrorMessage(error, "No se pudo subir la imagen"),
        color: "red",
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: undefined }));
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createCategory(formData);
      const categoryName = result?.name ?? formData.name;
      notifications.show({
        title: "Éxito",
        message: `Categoría "${categoryName}" creada exitosamente`,
        color: "green",
      });
      onClose();
    } catch (error: unknown) {
      notifications.show({
        title: "Error",
        message:
          extractApiErrorMessage(error, "Error al crear la categoría"),
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Nueva Categoría"
      centered
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
              <Text size="md" fw={700}>
                Datos de la Categoría
              </Text>
              <TextInput
                label="Nombre"
                placeholder="Ej. Electrónica"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Textarea
                label="Descripción"
                placeholder="Descripción de la categoría..."
                minRows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value || null,
                  })
                }
              />
              <Checkbox
                label="Categoría raíz"
                checked={formData.parent_id === null}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_id: e.target.checked ? null : undefined,
                  })
                }
              />
              <CategorySelector
                value={formData.parent_id}
                onChange={(id) =>
                  setFormData({ ...formData, parent_id: id })
                }
                showBreadcrumbs
              />

              <Stack gap="xs">
                <Text size="sm" fw={600}>
                  Imagen
                </Text>
                {preview ? (
                  <Stack gap={3} align="center">
                    <Image
                      src={preview}
                      h={100}
                      w="auto"
                      fit="contain"
                      radius="sm"
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Stack>
                ) : (
                  <FileInput
                    placeholder="Seleccionar imagen"
                    leftSection={<IconPhoto size={16} />}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    loading={isUploading}
                    clearable
                  />
                )}
              </Stack>

              <Group justify="flex-end">
                <Button variant="subtle" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" loading={isCreating}>
                  Crear Categoría
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </form>
    </Modal>
  );
};
