import { useState } from "react";
import { Button, Group, Stack, Checkbox } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";
import type { UserAdminRead, UserRoleRead } from "../../types/user";
import { useAdminUserMutations } from "../../hooks/admin/useAdminUserMutations";
import { roleConfig } from "../../types/configs";
import UserRoleInfo from "../UserRoleInfo";

interface Props {
  user: UserAdminRead;
  onClose: () => void;
}

const allRoleCodes = Object.keys(roleConfig);

export const isRoleExpired = (role: UserRoleRead) =>
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
      <UserRoleInfo roles={user.roles} />
    </Stack>
  );
};
