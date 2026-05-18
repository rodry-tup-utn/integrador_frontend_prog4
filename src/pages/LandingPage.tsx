import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { ROUTES } from "../shared/constants/routes";
import {
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Group,
  Box,
} from "@mantine/core";
import {
  IconPackage,
  IconTruck,
  IconCreditCard,
  IconClipboardCheck,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconPackage,
    title: "Catálogo Completo",
    description:
      "Explorá nuestra variedad de productos con ingredientes frescos y de calidad",
    color: "teal",
  },
  {
    icon: IconTruck,
    title: "Entrega a Domicilio",
    description:
      "Recibí tu pedido en la puerta de tu casa de forma rápida y segura",
    color: "blue",
  },
  {
    icon: IconCreditCard,
    title: "Pagos Seguros",
    description: "Procesamos tus pagos de forma segura a través de MercadoPago",
    color: "orange",
  },
  {
    icon: IconClipboardCheck,
    title: "Seguimiento",
    description:
      "Seguimos el estado de tu pedido desde la preparación hasta la entrega",
    color: "grape",
  },
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero */}
      <Box
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-teal-7), var(--mantine-color-teal-9))",
          color: "white",
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <Container size="md">
          <Title order={1} size={48} mb="md" fw={800}>
            Food Store
          </Title>
          <Text size="xl" mb="xl" opacity={0.85}>
            Tu tienda de productos frescos, directo a tu mesa. Calidad y
            frescura en cada pedido.
          </Text>
          <Group justify="center">
            <Button
              component={Link}
              to={ROUTES.PUBLIC_PRODUCTS}
              size="lg"
              variant="white"
              color="teal"
              radius="md"
            >
              Ver Nuestros Productos
            </Button>
            <Button
              component={Link}
              to={ROUTES.PUBLIC_INGREDIENTS}
              size="lg"
              variant="white"
              color="teal"
              radius="md"
            >
              Ver Nuestros Ingredientes
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Features */}
      <Container size="lg" py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" pt="xl">
          {features.map(({ icon: Icon, title, description, color }) => (
            <Paper key={title} p="xl" withBorder radius="md">
              <Group mb="sm">
                <ThemeIcon size={48} radius="md" color={color} variant="light">
                  <Icon size={28} />
                </ThemeIcon>
                <Title order={3}>{title}</Title>
              </Group>
              <Text c="dimmed" size="sm" lh={1.6}>
                {description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA */}
      <Box bg="gray.0" py="xl">
        <Container size="md" ta="center">
          <Title order={2} mb="sm">
            ¿Listo para comenzar?
          </Title>
          <Text c="dimmed" mb="lg">
            {isAuthenticated
              ? "Explorá tu panel y gestioná tus pedidos"
              : "Registrate y empezá a disfrutar de productos frescos"}
          </Text>
          <Group justify="center">
            {isAuthenticated ? (
              <Button component={Link} to={ROUTES.HOME} size="md">
                Ir al Dashboard
              </Button>
            ) : (
              <>
                <Button component={Link} to={ROUTES.REGISTER} size="md">
                  Registrarse
                </Button>
                <Button
                  component={Link}
                  to={ROUTES.LOGIN}
                  variant="outline"
                  size="md"
                >
                  Iniciar Sesión
                </Button>
              </>
            )}
          </Group>
        </Container>
      </Box>
    </Box>
  );
};
