import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Text,
  Breadcrumbs,
  Anchor,
  Checkbox,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { CategoryPrivate, CategoryCreate } from "../types/category";
import { CategoryParentSelector } from "./CategoryParentSelector";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import { useCategoryPath } from "../hooks/useCategoryPath";
import { toDateString } from "../../../shared/helpers/helpers";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

interface Props {
  opened: boolean;
  onClose: () => void;
  categoryData: CategoryPrivate;
}

export const CategoryEditModal = ({
  opened,
  onClose,
  categoryData,
}: Props) => {
  const { updateCategory, updateParentCategory, isUpdating } =
    useCategoryMutations();
  const [formData, setFormData] = useState<CategoryCreate>({
    name: categoryData.name,
    description: categoryData.description,
    parent_id: categoryData.parent_id || undefined,
  });
  const { data: categoryPath } = useCategoryPath(formData.parent_id);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: categoryData.name,
      description: categoryData.description,
      parent_id: categoryData.parent_id || undefined,
    });
  }, [categoryData, opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory({
        id: categoryData.id,
        data: {
          name: formData.name,
          description: formData.description || null,
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
      });
      onClose();
    } catch (error: unknown) {
      notifications.show({
        title: "Error",
        message:
          extractApiErrorMessage(error, "Error al actualizar la categoría"),
        color: "red",
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
                checked={formData.parent_id === null}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, parent_id: null });
                  }
                }}
              />
              <CategoryParentSelector
                value={formData.parent_id}
                onChange={(id) =>
                  setFormData({ ...formData, parent_id: id })
                }
                excludeId={categoryData.id}
              />
              {categoryPath && (
                <Breadcrumbs separator=">">
                  {categoryPath.path.map((name, index) => (
                    <Anchor
                      key={index}
                      size="sm"
                      c="dimmed"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      {name}
                    </Anchor>
                  ))}
                </Breadcrumbs>
              )}
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
                  <Text size="sm">
                    {toDateString(categoryData.deleted_at)}
                  </Text>
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
                <Text size="sm">
                  {toDateString(categoryData.created_at)}
                </Text>
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
