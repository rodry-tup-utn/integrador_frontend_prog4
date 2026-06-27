import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import {
  IconEdit,
  IconMapPin,
  IconTrash,
} from "@tabler/icons-react";
import type { AddressRead } from "../types/user";
import { toDateString } from "../../../shared/helpers/helpers";
import ActionButton from "../../../shared/components/ActionButton";

interface Props {
  address: AddressRead;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard = ({
  address,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Card
      shadow="none"
      withBorder
      radius="md"
      padding="md"
    >
      <Group justify="space-between" wrap="nowrap" align="center">
        <Stack gap={4}>
          <Group gap="xs">
            <IconMapPin size={16} />
            <Text fw={600}>{address.alias}</Text>
            {address.is_main && (
              <Badge size="xs" variant="light" color="teal">
                Principal
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
          <ActionButton
            icon={IconEdit}
            label="Editar"
            onClick={onEdit}
            color="blue"
          />
          <ActionButton
            icon={IconTrash}
            label="Eliminar"
            onClick={onDelete}
            color="red"
          />
        </Group>
      </Group>
    </Card>
  );
};

export default AddressCard;
