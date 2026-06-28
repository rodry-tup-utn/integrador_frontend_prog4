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
import { IconPhoto, IconTrash, IconExclamationCircleFilled, IconCircleCheckFilled } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import type { CategoryPrivate, CategoryCreate } from "../types/category";
import { CategorySelector } from "./CategorySelector";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import { toDateString } from "../../../shared/helpers/helpers";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import useImageUpload from "../../upload/hooks/useImageUpload";

interface Props {
  opened: boolean;
  onClose: () => void;
  categoryData: CategoryPrivate;
}

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
  return match?.[1] ?? null;
}

export const CategoryEditModal = ({ opened, onClose, categoryData }: Props) => {
  const { updateCategory, updateParentCategory, isUpdating } =
    useCategoryMutations();
  const { uploadImage, deleteImage, isUploading } = useImageUpload();
  const [formData, setFormData] = useState<CategoryCreate>({
    name: categoryData.name,
    description: categoryData.description,
    parent_id: categoryData.parent_id ?? undefined,
  });
  const [preview, setPreview] = useState<string | null>(categoryData.image_url);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: categoryData.name,
      description: categoryData.description,
      parent_id: categoryData.parent_id ?? undefined,
    });
    setPreview(categoryData.image_url);
  }, [categoryData, opened]);

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
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleRemoveImage = async () => {
    if (!preview) return;
    try {
      const publicId = extractPublicId(preview);
      if (publicId) await deleteImage(publicId);
    } catch {
      // si falla cleanup igual limpiamos local
    }
    setFormData((prev) => ({ ...prev, image_url: null }));
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory({
        id: categoryData.id,
        data: {
          name: formData.name,
          description: formData.description || null,
          image_url: formData.image_url ?? null,
        },
      });

      if (formData.parent_id !== categoryData.parent_id) {
        await updateParentCategory({
          id: categoryData.id,
          data: { parent_id: formData.parent_id ?? null },
        });
      }

      notifications.show({
        title: "Éxito",
        message: `Categoría "${formData.name}" actualizada exitosamente`,
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
      onClose();
    } catch (error: unknown) {
      notifications.show({
        title: "Error",
        message: extractApiErrorMessage(
          error,
          "Error al actualizar la categoría",
        ),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Editar Categoría"
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
                checked={formData.parent_id === undefined}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_id: e.target.checked ? null : undefined,
                  })
                }
              />
              <CategorySelector
                value={formData.parent_id}
                onChange={(id) => setFormData({ ...formData, parent_id: id })}
                excludeId={categoryData.id}
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
                    <Group gap="xs">
                      <FileInput
                        placeholder="Cambiar"
                        leftSection={<IconPhoto size={16} />}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        loading={isUploading}
                        clearable
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={handleRemoveImage}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
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
                <Button type="submit" loading={isUpdating}>
                  Guardar Cambios
                </Button>
              </Group>
            </Stack>
          </Paper>

          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Text size="md" fw={700}>
                Información de la Categoría
              </Text>
              {categoryData.deleted_at && (
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Inactivo desde:
                  </Text>
                  <Text size="sm">{toDateString(categoryData.deleted_at)}</Text>
                </Group>
              )}
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  ID:
                </Text>
                <Text size="sm">{categoryData.id}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  Creado:
                </Text>
                <Text size="sm">{toDateString(categoryData.created_at)}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  Actualizado:
                </Text>
                <Text size="sm">
                  {categoryData.updated_at
                    ? toDateString(categoryData.updated_at)
                    : "Sin modificaciones"}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </form>
    </Modal>
  );
};
