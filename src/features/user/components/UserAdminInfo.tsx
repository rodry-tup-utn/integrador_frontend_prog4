import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { toDateString } from "../../../shared/helpers/helpers";
import type { UserAdminRead } from "../types/user";

interface Props {
  user: UserAdminRead;
}

const UserAdminInfo = ({ user }: Props) => {
  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Stack gap="xs">
        <Text size="md" fw={700}>
          Información del Usuario
        </Text>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Creado:
          </Text>
          <Text size="sm">{toDateString(user.created_at)}</Text>
        </Group>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Última actualización:
          </Text>
          <Text size="sm">
            {user.updated_at
              ? toDateString(user.updated_at)
              : "Sin modificaciones"}
          </Text>
        </Group>
        {user.deleted_at ? (
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Inactivo desde:
            </Text>
            <Text size="sm">{toDateString(user.deleted_at)}</Text>
          </Group>
        ) : (
          <Badge variant="dot" color="green" size="sm">
            Activo
          </Badge>
        )}
      </Stack>
    </Paper>
  );
};

export default UserAdminInfo;
