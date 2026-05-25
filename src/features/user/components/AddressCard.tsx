import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconMapPin,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import type { AddressRead } from "../types/user";
import { toDateString } from "../../../shared/helpers/helpers";

interface Props {
  address: AddressRead;
  isDeleting: boolean;
  isRestoring: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRestore: () => void;
}

const AddressCard = ({
  address,
  isDeleting,
  isRestoring,
  onEdit,
  onDelete,
  onRestore,
}: Props) => {
  const isDeleted = !!address.deleted_at;

  return (
    <Card
      shadow="none"
      withBorder
      radius="md"
      opacity={isDeleted ? 0.6 : undefined}
      padding="md"
    >
      <Group
        justify="space-between"
        wrap="nowrap"
        align="flex-start"
      >
        <Stack gap={4}>
          <Group gap="xs">
            <IconMapPin size={16} />
            <Text fw={600}>{address.alias}</Text>
            {address.is_main && (
              <Badge size="xs" variant="light" color="teal">
                Principal
              </Badge>
            )}
            {isDeleted && (
              <Badge size="xs" variant="dot" color="red">
                Eliminada
              </Badge>
            )}
          </Group>
          <Text size="sm" c="dimmed">
            {address.line_one}
            {address.line_two ? `, ${address.line_two}` : ""}
          </Text>
          <Text size="sm" c="dimmed">
            {address.city}, {address.province} — CP: {address.zip_code}
          </Text>
          <Text size="xs" c="dimmed">
            Creada: {toDateString(address.created_at)}
          </Text>
        </Stack>
        <Group gap="xs" wrap="nowrap">
          <Button
            size="xs"
            variant="light"
            color="blue"
            onClick={onEdit}
          >
            Editar
          </Button>
          {isDeleted ? (
            <Button
              size="xs"
              variant="light"
              color="green"
              leftSection={<IconRefresh size={14} />}
              loading={isRestoring}
              onClick={onRestore}
            >
              Restaurar
            </Button>
          ) : (
            <Button
              size="xs"
              variant="light"
              color="red"
              leftSection={<IconTrash size={14} />}
              loading={isDeleting}
              onClick={onDelete}
            >
              Eliminar
            </Button>
          )}
        </Group>
      </Group>
    </Card>
  );
};

export default AddressCard;
