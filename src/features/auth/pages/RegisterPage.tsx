import {
  Center,
  Paper,
  Stack,
  Text,
  Title,
  TextInput,
  PasswordInput,
  Button,
  FocusTrap,
} from "@mantine/core";
import { usePublicUserCreate } from "../../user/hooks/public/usePublicUserCreate";
import type { UserCreate } from "../../user/types/user";
import { notifications } from "@mantine/notifications";
import { useNavigate, Navigate } from "react-router-dom";
import { IconAt, IconPhone, IconUser, IconExclamationCircleFilled } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "../../../shared/hooks/useForm";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { isLoading: isSessionLoading, isAuthenticated } = useAuth();
  const { isLoading, createPublicUser } = usePublicUserCreate();
  const navigate = useNavigate();
  const initialData: UserCreate = {
    name: "",
    lastname: "",
    email: "",
    phone_number: "",
    password: "",
  };

  const form = useForm(initialData);
  const [verifyPass, setVerifyPass] = useState("");

  if (isSessionLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.formState.password !== verifyPass) {
      notifications.show({
        message: "Las contraseñas no coinciden",
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
      return;
    }
    try {
      const data = await createPublicUser(form.formState);
      notifications.show({
        message: `Bienvendo ${data.name}, has creado tu usuario satifactoriamante!`,
        color: "teal",
      });
      navigate("/login");
    } catch (error: unknown) {
      const message = extractApiErrorMessage(error);
      notifications.show({
        message: message || "Erro al crear el usuario",
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };
  return (
    <Center style={{ height: "calc(100vh - 64px)" }}>
      <Paper shadow="md" p="xl" maw={420} w="100%" withBorder>
        <Stack ta="center" mb="lg">
          <Title order={2}>Registro de Nuevo Usuario</Title>
          <Text size="sm" c="dimmed">
            Ingresá tus datos para registrarte
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <FocusTrap active>
            <Stack>
              <TextInput
                name="name"
                leftSection={<IconUser />}
                label="Nombre"
                placeholder="Juan"
                onChange={form.handleChange}
                required
              />
              <TextInput
                name="lastname"
                label="Apellido"
                placeholder="Perez"
                leftSection={<IconUser />}
                required
                onChange={form.handleChange}
              />
              <TextInput
                name="email"
                type="email"
                label="Email"
                leftSection={<IconAt />}
                placeholder="jperez@mail.com"
                required
                onChange={form.handleChange}
              />
              <TextInput
                name="phone_number"
                type="tel"
                label="Teléfono"
                leftSection={<IconPhone />}
                placeholder="Ingresa tu teléfono (opcional)"
                onChange={form.handleChange}
              />
              <PasswordInput
                name="password"
                label="Contraseña"
                placeholder="********"
                required
                onChange={form.handleChange}
              />
              <PasswordInput
                name="passwordVerify"
                label="Verifica tu contraseña"
                placeholder="********"
                required
                onChange={(e) => setVerifyPass(e.currentTarget.value)}
              />
              <Button type="submit" loading={isLoading} fullWidth mt="sm">
                Registrarme
              </Button>
            </Stack>
          </FocusTrap>
        </form>
      </Paper>
    </Center>
  );
};

export default RegisterPage;
