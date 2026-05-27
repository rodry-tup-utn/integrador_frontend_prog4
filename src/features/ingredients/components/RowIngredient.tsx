import type { IngredientPrivate } from "../types/ingredient";
import { Table, Badge, Button, Group, Text } from "@mantine/core";
import { showConfirm } from "../../../shared/components/ShowConfirm";

interface RowIngredientProps {
  item: IngredientPrivate;
  onEdit: (id: string) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
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

      <Table.Td>
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
      <Table.Td>
        <Badge color={isDeleted ? "red" : "teal"} variant="dot" size="md">
          {isDeleted ? "Eliminado" : "Activo"}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap="sm" justify="center">
          <Button
            size="xs"
            variant="light"
            color={isDeleted ? "gray" : "blue"}
            onClick={() => onEdit(item.id.toString())}
          >
            {isDeleted ? "Detalle" : "Editar"}
          </Button>
          {isAdmin && (
            <Button
              size="xs"
              variant="light"
              color={isDeleted ? "green" : "red"}
              loading={isDeleting || isRestoring}
              onClick={handleAction}
            >
              {label}
            </Button>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};
