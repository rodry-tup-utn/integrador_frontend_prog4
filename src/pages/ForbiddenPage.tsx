import { Link } from "react-router-dom";
import { Center, Stack, Title, Text, Button } from "@mantine/core";
import { IconLock, IconArrowLeft } from "@tabler/icons-react";
import { ROUTES } from "../shared/constants/routes";

export const ForbiddenPage = () => {
  return (
    <Center style={{ height: "60vh" }}>
      <Stack align="center">
        <IconLock size={64} color="orange" />
        <Title order={2}>Acceso Denegado</Title>
        <Text>No tenés permisos para acceder a esta sección.</Text>
        <Button
          component={Link}
          to={ROUTES.LANDING}
          leftSection={<IconArrowLeft size={16} />}
        >
          Volver al inicio
        </Button>
      </Stack>
    </Center>
  );
};
