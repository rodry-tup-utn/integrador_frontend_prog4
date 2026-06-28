import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Center,
  FocusTrap,
} from "@mantine/core";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconAt, IconPassword, IconExclamationCircleFilled } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const data = await login(formData);
      notifications.show({ message: `Bienvenido ${data.name}` });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      notifications.show({
        color: "red",
        title: "Error",
        message: extractApiErrorMessage(err, "Error al iniciar sesión"),
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  return (
    <Center style={{ height: "calc(100vh - 64px)" }}>
      <Paper shadow="md" p="xl" maw={420} w="100%" withBorder>
        <Stack ta="center" mb="lg">
          <Title order={2}>Bienvenido</Title>
          <Text size="sm" c="dimmed">
            Ingresá tus credenciales para acceder
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <FocusTrap active>
            <Stack>
              <TextInput
                name="username"
                leftSection={<IconAt />}
                label="Email"
                placeholder="tu@email.com"
                required
              />
              <PasswordInput
                leftSection={<IconPassword />}
                name="password"
                label="Contraseña"
                placeholder="********"
                required
              />
              <Button type="submit" loading={isLoading} fullWidth mt="sm">
                Iniciar Sesión
              </Button>
            </Stack>
          </FocusTrap>
        </form>
      </Paper>
    </Center>
  );
};
