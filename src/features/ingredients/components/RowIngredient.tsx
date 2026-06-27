import type { IngredientPrivate } from "../types/ingredient";
import { Table, Badge, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import ActionButton from "../../../shared/components/ActionButton";
import { IconEdit, IconEye, IconRestore, IconTrash } from "@tabler/icons-react";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";

interface RowIngredientProps {
  item: IngredientPrivate;
  onEdit: (id: string) => void;
  onDelete: (id: number) => Promise<void>;
  onRestore: (id: number) => Promise<void>;
  isDeleting?: boolean;
  isRestoring?: boolean;
  isAdmin: boolean;
}

export const RowIngredient = ({
  item,
  onEdit,
  onDelete,
  onRestore,
  isDeleting,
  isRestoring,
  isAdmin,
}: RowIngredientProps) => {
  const { data: measurementUnits } = useMeasurementUnits();
  const isDeleted = !!item.deleted_at;

  const unitLabel =
    measurementUnits?.find((u) => u.code === item.measurement_unit_code)
      ?.name ?? item.measurement_unit_code;

  const restoreAction = {
    text: `¿Restaurar "${item.name}"?`,
    label: "Restaurar",
    fn: () => onRestore(item.id),
    textLoading: "Restaurando...",
    color: "teal",
  };
  const deleteAction = {
    text: `¿Eliminar "${item.name}"?`,
    label: "Eliminar",
    fn: () => onDelete(item.id),
    textLoading: "Eliminando...",
    color: "red",
  };

  const finalAction = isDeleted ? restoreAction : deleteAction;

  const handleAction = () => {
    if (isDeleted) {
      handleRestoreDirect();
      return;
    }
    showConfirm({
      title: deleteAction.text,
      confirmLabel: deleteAction.label,
      onConfirm: async () => deleteAction.fn(),
      successMessage: "Operacion completada!",
      color: deleteAction.color,
    });
  };

  const handleRestoreDirect = async () => {
    try {
      await onRestore(item.id);
      notifications.show({
        title: "Operación Exitosa",
        color: "green",
        message: `"${item.name}" restaurado`,
      });
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(
        error,
        `No se pudo restaurar "${item.name}"`,
      );
      notifications.show({ message: msg, color: "red" });
    }
  };

  const label =
    isRestoring || isDeleting ? finalAction.textLoading : finalAction.label;

  return (
    <Table.Tr opacity={isDeleted ? 0.6 : undefined}>
      <Table.Td>
        <Text size="md" c="dimmed" fs="italic">
          #{item.id}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text td={isDeleted ? "line-through" : undefined} fw={500}>
          {item.name}
        </Text>
      </Table.Td>

      <Table.Td ta="center">
        <Text> {item.stock} </Text>
      </Table.Td>
      <Table.Td ta="center">
        <Text>{unitLabel} </Text>
      </Table.Td>
      <Table.Td ta="center">
        {item.is_allergen ? (
          <Badge color="red" variant="light" size="lg">
            Alergeno
          </Badge>
        ) : (
          <Badge color="green" variant="light" size="lg">
            Seguro
          </Badge>
        )}
      </Table.Td>
      <Table.Td ta="center">
        <Badge color={isDeleted ? "red" : "teal"} variant="dot" size="md">
          {isDeleted ? "Eliminado" : "Activo"}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap="sm" justify="center">
          <ActionButton
            icon={isDeleted ? IconEye : IconEdit}
            label={isDeleted ? "Ver detalle" : "Editar"}
            color={isDeleted ? "gray" : "blue"}
            onClick={() => onEdit(item.id.toString())}
          />

          {isAdmin && (
            <ActionButton
              icon={isDeleted ? IconRestore : IconTrash}
              label={label}
              color={isDeleted ? "green" : "red"}
              onClick={handleAction}
            />
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};
