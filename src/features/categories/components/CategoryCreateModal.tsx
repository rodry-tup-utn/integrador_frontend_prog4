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
import type { CategoryCreate } from "../types/category";
import { CategoryParentSelector } from "./CategoryParentSelector";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import { useCategoryPath } from "../hooks/useCategoryPath";

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
  const [formData, setFormData] = useState<CategoryCreate>(initialState);
  const { data: categoryPath } = useCategoryPath(formData.parent_id);

  useEffect(() => {
    if (opened) setFormData(initialState);
  }, [opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createCategory(formData);
      const categoryName = (result as any)?.name ?? formData.name;
      notifications.show({
        title: "Éxito",
        message: `Categoría "${categoryName}" creada exitosamente`,
        color: "green",
      });
      onClose();
    } catch (error: any) {
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
