import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import type { UserRoleRead } from "../types/user";
import { roleConfig } from "../types/configs";
import { isRoleExpired } from "../utils/roleUtils";
import { toDateString } from "../../../shared/helpers/helpers";
interface Props {
  roles: UserRoleRead[];
}
const UserRoleInfo = ({ roles }: Props) => {
  return (
    <Stack>
      <Text size="md" fw={700}>
        Historial de Roles
      </Text>
      <Stack gap="sm">
        {[...roles]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .map((role) => {
            const config = roleConfig[role.role_user.code];
            const expired = isRoleExpired(role);
            return (
              <Paper
                key={`${role.role_user.code}-${role.created_at}`}
                shadow="sm"
                p="sm"
                radius="md"
                withBorder
              >
                <Group justify="space-between" mb="xs">
                  <Badge size="lg" color={config.color}>
                    {config.label}
                  </Badge>
                  <Badge variant="dot" color={expired ? "red" : "green"}>
                    {expired ? "Expirado" : "Activo"}
                  </Badge>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Asignado:
                  </Text>
                  <Text size="sm">{toDateString(role.created_at)}</Text>
                </Group>
                {role.expires_at && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">
                      {expired ? "Expirado:" : "Expira:"}
                    </Text>
                    <Text size="sm">{toDateString(role.expires_at)}</Text>
                  </Group>
                )}
              </Paper>
            );
          })}
      </Stack>
    </Stack>
  );
};

export default UserRoleInfo;
