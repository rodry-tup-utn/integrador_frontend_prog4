import { useState, useEffect } from "react";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import type { CategoryPrivate, CategoryCreate } from "../types/category";
import { CategoryParentSelector } from "./CategoryParentSelector";
import { notifications } from "@mantine/notifications";
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
} from "@mantine/core";
import { useCategoryPath } from "../hooks/useCategoryPath";

interface Props {
  opened: boolean;
  onClose: () => void;
  categoryData?: CategoryPrivate | null;
}

const initialState: CategoryCreate = {
  name: "",
  description: null,
  parent_id: undefined,
};

export const CategoryModal = ({ opened, onClose, categoryData }: Props) => {
  const {
    createCategory,
    updateCategory,
    isCreating,
    isUpdating,
    updateParentCategory,
  } = useCategoryMutations();
  const [formData, setFormData] = useState(initialState);

  const { data: categoryPath } = useCategoryPath(formData.parent_id);

  useEffect(() => {
    if (categoryData) {
      setFormData({
        name: categoryData.name,
        description: categoryData.description,
        parent_id: categoryData.parent_id || undefined,
      });
    } else {
      setFormData(initialState);
    }
  }, [categoryData, opened]);

  const isEditing = !!categoryData;
  const isLoading = isCreating || isUpdating;
  const title = isEditing ? "Editar Categoría" : "Nueva Categoría";

  const getActionConfig = () => {
    const baseConfig = {
      submit: isEditing
        ? () =>
            updateCategory({
              id: categoryData.id,
              data: {
                name: formData.name,
                description: formData.description || null,
              },
            })
        : () => createCategory(formData),
      successMessage: isEditing ? "actualizada" : "creada",
      label: isEditing ? "Guardar Cambios" : "Crear Categoría",
    };
    // Si es edición y hay cambio de padre, agregar updateParentCategory
    if (isEditing && formData.parent_id !== undefined) {
      return {
        ...baseConfig,
        submit: async () => {
          const result = await baseConfig.submit();
          if (formData.parent_id !== undefined) {
            await updateParentCategory({
              id: categoryData.id,
              data: { parent_id: formData.parent_id },
            });
          }
          return result;
        },
      };
    }
    return baseConfig;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = getActionConfig();
    try {
      const result = await action.submit();
      const categoryName = (result as CategoryPrivate)?.name ?? formData.name;
      notifications.show({
        title: "Éxito",
        message: `Categoría "${categoryName}" ${action.successMessage} exitosamente`,
        color: "green",
      });
      onClose();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.detail || "Error al ejecutar la operación",
        color: "red",
      });
    }
  };

  const footer = (
    <Group justify="flex-end">
      <Button variant="subtle" onClick={onClose}>
        Cancelar
      </Button>
      <Button loading={isLoading} onClick={handleSubmit}>
        {isEditing ? "Guardar Cambios" : "Crear Categoría"}
      </Button>
    </Group>
  );

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="lg">
      <Stack gap="md">
        <TextInput
          label="Nombre"
          placeholder="Ej. Electrónica"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          onChange={(id) => setFormData({ ...formData, parent_id: id })}
          excludeId={categoryData?.id}
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

        {isEditing && (
          <Stack gap="xs" pt="md">
            <Text size="xs" c="dimmed">
              ID: {categoryData.id}
            </Text>
            {categoryData.created_at && (
              <Text size="xs" c="dimmed">
                Creado: {new Date(categoryData.created_at).toLocaleDateString()}
              </Text>
            )}
            {categoryData.updated_at && (
              <Text size="xs" c="dimmed">
                Actualizado:{" "}
                {new Date(categoryData.updated_at).toLocaleDateString()}
              </Text>
            )}
          </Stack>
        )}
      </Stack>
      {footer}
    </Modal>
  );
};
