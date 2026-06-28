import { Badge, Group, Stack, Table, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { UserAdminRead, UserRoleRead } from "../../types/user";
import { roleConfig } from "../../types/configs";
import ActionButton from "../../../../shared/components/ActionButton";
import { IconEdit, IconRestore, IconTrash, IconExclamationCircleFilled } from "@tabler/icons-react";
import { showConfirm } from "../../../../shared/components/ShowConfirm";
import { useAdminUserMutations } from "../../hooks/admin/useAdminUserMutations";
import { extractApiErrorMessage } from "../../../../shared/helpers/apiErrors";
import { useState } from "react";

interface Props {
  user: UserAdminRead;
  handleEdit: () => void;
}

const UserAdminRow = ({ user, handleEdit: onEdit }: Props) => {
  const isDeleted = !!user.deleted_at;
  const [now] = useState(() => Date.now());
  const isRoleExpired = (role: UserRoleRead) =>
    !!role.expires_at && new Date(role.expires_at).getTime() < now;

  const { restoreUser, deleteUser, isLoading, restorePass } =
    useAdminUserMutations();

  const handleRestore = async (user: UserAdminRead) => {
    try {
      await restoreUser(user.id);
      notifications.show({
        title: "Operación Exitosa",
        color: "green",
        message: `Usuario ${user.name} restaurado!`,
      });
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(
        error,
        `No se pudo restaurar ${user.name}`,
      );
      notifications.show({ title: "Error", message: msg, color: "red", radius: "lg", icon: <IconExclamationCircleFilled /> });
    }
  };

  const handleDelete = (user: UserAdminRead) => {
    showConfirm({
      title: `¿Eliminar usuario "${user.name}"?`,
      confirmLabel: "Eliminar",
      color: "red",
      onConfirm: () => deleteUser(user.id),
      successMessage: `Usuario ${user.name} eliminado!`,
    });
  };

  const handleRestorePass = (user: UserAdminRead) => {
    showConfirm({
      title: `Restaurar contraseña de usuario ${user.name}?`,
      confirmLabel: "Restaurar",
      color: "cyan",
      onConfirm: () => restorePass(user.id),
      successMessage: `Contreseña de usuario ${user.name} restaurada a "12345"`,
    });
  };

  return (
    <>
      <Table.Tr key={user.id} opacity={isDeleted ? 0.6 : undefined}>
        <Table.Td>
          <Text size="sm" c="dimmed">
            #{user.id}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text td={isDeleted ? "line-through" : undefined} fw={500}>
            {user.lastname}, {user.name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fw={500}>{user.email}</Text>
        </Table.Td>
        <Table.Td>
          {user.roles.length > 0 ? (
            <Stack justify="center" align="center" gap="xs">
              {user.roles.map((role) => {
                const revoked = isRoleExpired(role);
                return (
                  <Badge
                    key={role.role_user.code}
                    color={roleConfig[role.role_user.code]?.color ?? "gray"}
                    variant={revoked ? "dot" : "light"}
                    size="sm"
                    style={
                      revoked
                        ? {
                            textDecoration: "line-through",
                            opacity: 0.5,
                          }
                        : undefined
                    }
                  >
                    {roleConfig[role.role_user.code]?.label ??
                      role.role_user.code}
                  </Badge>
                );
              })}
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">
              Sin roles
            </Text>
          )}
        </Table.Td>
        <Table.Td>
          <Badge color={isDeleted ? "red" : "teal"} variant="dot" size="sm">
            {isDeleted ? "Eliminado" : "Activo"}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Group gap="xs" justify="center">
            <ActionButton
              icon={IconEdit}
              label="Editar Usuario"
              color="blue"
              onClick={onEdit}
            />
            <ActionButton
              icon={isDeleted ? IconRestore : IconTrash}
              label={isDeleted ? "Restaurar" : "Eliminar"}
              onClick={
                isDeleted ? () => handleRestore(user) : () => handleDelete(user)
              }
              color={isDeleted ? "green" : "red"}
            />
            <ActionButton
              disabled={isLoading}
              icon={IconRestore}
              label="Restaurar contraseña"
              onClick={() => handleRestorePass(user)}
              color="purple"
            />
          </Group>
        </Table.Td>
      </Table.Tr>
    </>
  );
};

export default UserAdminRow;
