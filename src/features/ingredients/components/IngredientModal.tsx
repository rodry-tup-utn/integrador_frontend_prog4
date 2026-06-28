import { useIngredientMutations } from "../hooks/useIngredientMutations";
import { useState, useEffect } from "react";
import type { IngredientPrivate } from "../types/ingredient";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";
import { formatDate } from "../helpers/helpers";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Checkbox,
  Paper,
} from "@mantine/core";

interface Props {
  opened: boolean;
  onClose: () => void;
  ingredientData?: IngredientPrivate | null;
  isDeleted: boolean;
}

const initialState = {
  name: "",
  description: "",
  is_allergen: false,
  stock: 0,
  measurement_unit_code: "LITER",
};

export const IngredientModal = ({
  opened,
  onClose,
  ingredientData,
  isDeleted,
}: Props) => {
  const { createIngredient, updateIngredient, isCreating, isUpdating } =
    useIngredientMutations();
  const { data: measurementUnits } = useMeasurementUnits();
  const [formData, setFormData] = useState(initialState);

  const unitOptions = (measurementUnits ?? []).map((u) => ({
    value: u.code,
    label: u.name,
  }));

  useEffect(() => {
    if (ingredientData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: ingredientData.name,
        description: ingredientData.description || "",
        is_allergen: ingredientData.is_allergen,
        stock: ingredientData.stock,
        measurement_unit_code: ingredientData.measurement_unit_code,
      });
    } else {
      setFormData(initialState);
    }
  }, [ingredientData, opened]);

  const isEditing = !!ingredientData;
  const isLoading = isCreating || isUpdating;

  const actionConfig = isDeleted
    ? null
    : isEditing && ingredientData
      ? {
          successMessage: "editado",
          submit: () =>
            updateIngredient({
              id: ingredientData.id,
              data: formData,
            }),
        }
      : {
          successMessage: "creado",
          submit: () => createIngredient(formData),
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!actionConfig) return;

    try {
      const result = await actionConfig.submit();

      notifications.show({
        title: "Éxito al guardar",
        message: `Ingrediente ${result.name} ${actionConfig.successMessage} exitosamente`,
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });

      onClose();
    } catch (error: unknown) {
      notifications.show({
        title: "Error",
        message: extractApiErrorMessage(error),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const title = isDeleted
    ? "Detalle Ingrediente"
    : isEditing
      ? "Editar Ingrediente"
      : "Nuevo Ingrediente";

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Nombre"
            placeholder="Ej. Harina de Trigo"
            required
            disabled={isDeleted}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoFocus
          />

          <Textarea
            label="Descripción"
            placeholder="Detalles del ingrediente..."
            disabled={isDeleted}
            minRows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <SimpleGrid cols={2}>
            <TextInput
              label="Stock"
              placeholder="0"
              type="number"
              required
              disabled={isDeleted}
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
            />
            <Select
              label="Unidad de Medida"
              placeholder="Seleccionar unidad"
              data={unitOptions}
              disabled={isDeleted}
              value={formData.measurement_unit_code}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  measurement_unit_code: value ?? "LITER",
                })
              }
              nothingFoundMessage="Sin resultados"
            />
          </SimpleGrid>

          <Checkbox
            label="¿Es un alérgeno?"
            description="Marcar si requiere advertencia sanitaria."
            disabled={isDeleted}
            checked={formData.is_allergen}
            onChange={(e) =>
              setFormData({
                ...formData,
                is_allergen: e.currentTarget.checked,
              })
            }
            color="red"
          />

          {isEditing && (
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Stack gap="xs">
                <Text size="md" fw={700}>
                  Información del Ingrediente
                </Text>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    ID:
                  </Text>
                  <Text size="sm">{ingredientData.id}</Text>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Creado:
                  </Text>
                  <Text size="sm">{formatDate(ingredientData.created_at)}</Text>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Actualizado:
                  </Text>
                  <Text size="sm">
                    {ingredientData.updated_at
                      ? formatDate(ingredientData.updated_at)
                      : "Sin cambios"}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          {!isDeleted && (
            <Group justify="flex-end">
              <Button variant="subtle" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={isLoading}>
                {isEditing ? "Guardar Cambios" : "Crear Ingrediente"}
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </Modal>
  );
};
