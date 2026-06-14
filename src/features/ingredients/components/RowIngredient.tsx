import type { IngredientPrivate, MeasurementUnit } from "../types/ingredient";
import { Table, Badge, Group, Text } from "@mantine/core";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import ActionButton from "../../../shared/components/ActionButton";
import { IconEdit, IconEye, IconRestore, IconTrash } from "@tabler/icons-react";

interface RowIngredientProps {
  item: IngredientPrivate;
  onEdit: (id: string) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  isDeleting?: boolean;
  isRestoring?: boolean;
  isAdmin: boolean;
}

const mapUnit = (unit: MeasurementUnit) => {
  switch (unit) {
    case "GRAMS":
      return "Gramos";
    case "KILOGRAMS":
      return "Kilogramos";
    case "LITER":
      return "Litros";
    case "MILILITER":
      return "Mililitros";
    default:
      return "Unidades";
  }
};

export const RowIngredient = ({
  item,
  onEdit,
  onDelete,
  onRestore,
  isDeleting,
  isRestoring,
  isAdmin,
}: RowIngredientProps) => {
  const isDeleted = !!item.deleted_at;

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
    showConfirm({
      title: finalAction.text,
      confirmLabel: finalAction.label,
      onConfirm: async () => finalAction.fn(),
      successMessage: "Operacion completada!",
      color: finalAction.color,
    });
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
        <Text>{mapUnit(item.measurement_unit)} </Text>
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
