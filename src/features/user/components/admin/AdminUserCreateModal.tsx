import { useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  PasswordInput,
  Select,
} from "@mantine/core";
import { type UserCreateByAdmin, type RoleCodes } from "../../types/user";
import { useAdminUserMutations } from "../../hooks/admin/useAdminUserMutations";
import { IconPlus } from "@tabler/icons-react";

interface Props {
  opened: boolean;
  onClose: () => void;
}

const roles = [
  { value: "CLIENT", label: "Cliente" },
  { value: "ADMIN", label: "Administrador" },
  { value: "STOCK", label: "Control de Stock" },
  { value: "ORDERS", label: "Control de Ordenes" },
];

const initialState: UserCreateByAdmin = {
  lastname: "",
  name: "",
  email: "",
  password: "",
  phone_number: null,
  role_code: "CLIENT",
};

export const AdminUserCreateModal = ({ opened, onClose }: Props) => {
  const { createUser, isLoading } = useAdminUserMutations();
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await createUser(formData);

      notifications.show({
        title: "Éxito",
        message: `Usuario "${newUser.name} creado exitosamente`,
        color: "green",
      });
      onClose();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.detail ||
          "Error al crear el usuario la operación",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      title="Agregar Nuevo Usuario"
      onClose={onClose}
      centered
      size="md"
    >
      <Stack gap="md">
        <TextInput
          label="Apellido"
          placeholder="Ingresa el apellido del usuario..."
          required
          value={formData.lastname}
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value })
          }
        />
        <TextInput
          label="Nombre"
          placeholder="Ingresa el nombre del usuario..."
          required
          value={formData.name || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value || "",
            })
          }
        />
        <TextInput
          label="Email"
          placeholder="mail@example.com"
          required
          value={formData.email || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value || "",
            })
          }
        />
        <PasswordInput
          label="Password"
          placeholder="*********"
          required
          value={formData.password || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value || "",
            })
          }
        />

        <Select
          label="Rol"
          placeholder="Selecciona el rol"
          data={roles}
          value={formData.role_code}
          onChange={(value) =>
            setFormData({ ...formData, role_code: value as RoleCodes })
          }
        />

        <Group justify="flex-end" top={20}>
          <Button variant="subtle" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={isLoading}
            rightSection={<IconPlus size={16} />}
            loading={isLoading}
            onClick={handleSubmit}
          >
            Agregar Usuario
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
