import { useState } from "react";
import { Button, Group, Stack, Checkbox, Badge, Text, Paper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";
import type { UserAdminRead, UserRoleRead } from "../types/user";
import { useAdminUserMutations } from "../hooks/admin/useAdminUserMutations";
import { toDateString } from "../../../shared/helpers/helpers";

interface Props {
  user: UserAdminRead;
  onClose: () => void;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  CLIENT: { label: "Cliente", color: "blue" },
  ADMIN: { label: "Admin", color: "red" },
  STOCK: { label: "Stock", color: "yellow" },
  ORDERS: { label: "Órdenes", color: "grape" },
};

const allRoleCodes = Object.keys(roleConfig);

const isRoleExpired = (role: UserRoleRead) =>
  !!role.expires_at && new Date(role.expires_at).getTime() < Date.now();

export const AdminEditUserRoles = ({ user, onClose }: Props) => {
  const { assignRole, revokeRole, isLoading } = useAdminUserMutations();

  const [selectedRoles, setSelectedRoles] = useState<string[]>(() =>
    user.roles.filter((r) => !isRoleExpired(r)).map((r) => r.role_user.code),
  );

  const originalCodes = user.roles
    .filter((r) => !isRoleExpired(r))
    .map((r) => r.role_user.code);

  const handleToggle = (code: string) => {
    setSelectedRoles((prev) =>
      prev.includes(code) ? prev.filter((r) => r !== code) : [...prev, code],
    );
  };

  const handleSave = async () => {
    const toAssign = selectedRoles.filter((r) => !originalCodes.includes(r));
    const toRevoke = originalCodes.filter((r) => !selectedRoles.includes(r));

    try {
      const promises: Promise<unknown>[] = [
        ...toAssign.map((code) => assignRole({ id: user.id, roleCode: code })),
        ...toRevoke.map((code) => revokeRole({ id: user.id, roleCode: code })),
      ];

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      notifications.show({
        title: "Roles actualizados",
        message: "Los roles se actualizaron correctamente",
        color: "green",
      });
      onClose();
    } catch {
      notifications.show({
        title: "Error",
        message: "No se pudieron actualizar los roles",
        color: "red",
      });
    }
  };

  const hasChanges =
    selectedRoles.length !== originalCodes.length ||
    selectedRoles.some((r) => !originalCodes.includes(r));

  return (
    <Stack gap="md">
      <Stack gap="xs">
        {allRoleCodes.map((code) => {
          const role = user.roles.find((r) => r.role_user.code === code);
          const revoked = role ? isRoleExpired(role) : false;
          return (
            <Checkbox
              key={code}
              label={roleConfig[code].label}
              checked={selectedRoles.includes(code)}
              onChange={() => handleToggle(code)}
              color={roleConfig[code].color}
              styles={
                revoked
                  ? {
                      label: {
                        textDecoration: "line-through",
                        opacity: 0.5,
                      },
                    }
                  : undefined
              }
            />
          );
        })}
      </Stack>

      <Group justify="flex-end" mt="md">
        <Button
          rightSection={<IconDeviceFloppy size={16} />}
          loading={isLoading}
          disabled={!hasChanges}
          onClick={handleSave}
        >
          Guardar Roles
        </Button>
      </Group>
      <Stack>
        <Text size="md" fw={700}>
          Historial de Roles
        </Text>
        <Stack gap="sm">
          {[...user.roles]
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
                    <Text size="sm">
                      {toDateString(role.created_at)}
                    </Text>
                  </Group>
                  {role.expires_at && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        {expired ? "Expirado:" : "Expira:"}
                      </Text>
                      <Text size="sm">
                        {toDateString(role.expires_at)}
                      </Text>
                    </Group>
                  )}
                </Paper>
              );
            })}
        </Stack>
      </Stack>
    </Stack>
  );
};
