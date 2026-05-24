import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Stack,
  Badge,
  Text,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";
import type { UserAdminRead, UserUpdate } from "../types/user";
import { useAdminUserMutations } from "../hooks/admin/useAdminUserMutations";
import { toDateString } from "../../../shared/helpers/helpers";

interface Props {
  user: UserAdminRead;
  onClose: () => void;
}

export const AdminEditUserForm = ({ user, onClose }: Props) => {
  const { updateUser, isLoading } = useAdminUserMutations();
  const [formData, setFormData] = useState<UserUpdate>({
    name: user.name,
    lastname: user.lastname,
    email: user.email,
  });

  const hasChanges =
    formData.name !== user.name ||
    formData.lastname !== user.lastname ||
    formData.email !== user.email;

  const handleSubmit = async () => {
    try {
      await updateUser({ id: user.id, data: formData });
      notifications.show({
        title: "Usuario actualizado",
        message: "Los datos se guardaron correctamente",
        color: "green",
      });
      onClose();
    } catch {
      notifications.show({
        title: "Error",
        message: "No se pudo actualizar el usuario",
        color: "red",
      });
    }
  };

  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Stack gap="md">
          <Text size="md" fw={700}>
            Editar Datos
          </Text>
          <TextInput
            label="Nombre"
            placeholder="Ingresa el nombre del usuario..."
            required
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.currentTarget.value })
            }
          />
          <TextInput
            label="Apellido"
            placeholder="Ingresa el apellido del usuario..."
            required
            value={formData.lastname || ""}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.currentTarget.value })
            }
          />
          <TextInput
            label="Email"
            placeholder="mail@example.com"
            required
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.currentTarget.value })
            }
          />
          <Group justify="flex-end">
            <Button
              rightSection={<IconDeviceFloppy size={16} />}
              loading={isLoading}
              disabled={!hasChanges}
              onClick={handleSubmit}
            >
              Guardar Datos
            </Button>
          </Group>
        </Stack>
      </Paper>

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
    </Stack>
  );
};
