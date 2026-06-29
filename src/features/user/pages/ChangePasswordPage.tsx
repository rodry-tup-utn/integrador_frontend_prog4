import { useState } from "react";
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconExclamationCircleFilled, IconCircleCheckFilled } from "@tabler/icons-react";
import { useProfileMutations } from "../hooks/profile/useProfileMutations";
import { useNavigate } from "react-router-dom";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

export const ChangePasswordPage = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { updatePass, updatingPass } = useProfileMutations();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      notifications.show({
        message: "Las contraseñas nuevas no coinciden",
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
      return;
    }

    if (newPass.length < 8) {
      notifications.show({
        message: "La contraseña debe tener al menos 8 caracteres",
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
      return;
    }

    try {
      await updatePass({ old_pass: oldPass, new_pass: newPass });
      notifications.show({
        title: "Contraseña actualizada",
        message: "Contraseña actualizada correctamente",
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      navigate("/profile");
    } catch (error: unknown) {
      notifications.show({
        message:
          extractApiErrorMessage(error, "Error al cambiar la contraseña"),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  return (
    <Center>
      <Paper shadow="md" p="xl" maw={420} w="100%" withBorder>
        <Stack ta="center" mb="lg">
          <Title order={2}>Cambiar Contraseña</Title>
          <Text size="sm" c="dimmed">
            Ingresá tu contraseña actual y la nueva
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack>
            <PasswordInput
              label="Contraseña actual"
              placeholder="********"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.currentTarget.value)}
            />
            <PasswordInput
              label="Nueva contraseña"
              placeholder="********"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.currentTarget.value)}
            />
            <PasswordInput
              label="Confirmar nueva contraseña"
              placeholder="********"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.currentTarget.value)}
            />
            <Button type="submit" loading={updatingPass} fullWidth mt="sm">
              Cambiar Contraseña
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};
