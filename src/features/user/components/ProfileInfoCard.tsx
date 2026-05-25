import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy, IconEdit, IconX } from "@tabler/icons-react";
import type { UserProfileRead, UserUpdate } from "../types/user";
import { roleConfig } from "../types/configs";

interface Props {
  profile: UserProfileRead;
  editing: boolean;
  formData: UserUpdate;
  updatingProfile: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveProfile: () => void;
  onChange: (field: keyof UserUpdate, value: string) => void;
}

const ProfileInfoCard = ({
  profile,
  editing,
  formData,
  updatingProfile,
  onStartEdit,
  onCancelEdit,
  onSaveProfile,
  onChange,
}: Props) => {
  return (
    <Paper shadow="sm" withBorder radius="xl" p="lg" bd={"2px solid orange"}>
      <Group justify="space-between" mb="md">
        <Title order={4}>Datos Personales</Title>
        {!editing && (
          <Button
            color="orange"
            variant="light"
            leftSection={<IconEdit size={16} />}
            onClick={onStartEdit}
          >
            Editar
          </Button>
        )}
      </Group>

      {editing ? (
        <Stack gap="md">
          <TextInput
            label="Nombre"
            value={formData.name ?? ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
          />
          <TextInput
            label="Apellido"
            value={formData.lastname ?? ""}
            onChange={(e) => onChange("lastname", e.currentTarget.value)}
          />
          <TextInput
            label="Email"
            value={formData.email ?? ""}
            onChange={(e) => onChange("email", e.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button
              variant="subtle"
              color="orange"
              leftSection={<IconX size={16} />}
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              loading={updatingProfile}
              onClick={onSaveProfile}
              color="orange"
            >
              Guardar
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack gap="xs">
          <Group gap="xs">
            <Text size="sm" c="dimmed" w={80}>
              Nombre:
            </Text>
            <Text fw={500}>{profile.name}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed" w={80}>
              Apellido:
            </Text>
            <Text fw={500}>{profile.lastname}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed" w={80}>
              Email:
            </Text>
            <Text fw={500}>{profile.email}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed" w={80}>
              Roles:
            </Text>
            <Group gap="xs">
              {profile.roles.map((r) => (
                <Badge
                  key={r.role_user.code}
                  color={roleConfig[r.role_user.code]?.color ?? "gray"}
                  variant="light"
                  size="sm"
                >
                  {roleConfig[r.role_user.code]?.label ?? r.role_user.code}
                </Badge>
              ))}
            </Group>
          </Group>
        </Stack>
      )}
    </Paper>
  );
};

export default ProfileInfoCard;
