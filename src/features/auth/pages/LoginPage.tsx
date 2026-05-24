import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Center,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export const LoginPage = () => {
  const navigate = useNavigate();
  const { executeLogin, isLoading } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const success = await executeLogin(e);
    if (success) navigate("/dashboard");
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
          <Stack>
            <TextInput
              name="username"
              label="Email"
              placeholder="tu@email.com"
              required
            />
            <PasswordInput
              name="password"
              label="Contraseña"
              placeholder="********"
              required
            />
            <Button type="submit" loading={isLoading} fullWidth mt="sm">
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};
