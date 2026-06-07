import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { roleConfig } from "../features/user/types/configs";
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  SimpleGrid,
  Card,
  Avatar,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBurger,
  IconShoppingBag,
  IconUser,
  IconMeat,
  IconUsers,
  IconClipboardList,
  IconPackage,
  IconEgg,
  IconCategory,
  IconChefHat,
  IconLock,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { ROUTES } from "../shared/constants/routes";

interface QuickLink {
  to: string;
  label: string;
  description: string;
  icon: Icon;
  color: string;
}

interface QuickLinkSection {
  title: string;
  links: QuickLink[];
}

const getQuickLinks = (roles: string[]): QuickLinkSection[] => {
  const sections: QuickLinkSection[] = [];

  sections.push({
    title: "General",
    links: [
      {
        to: ROUTES.PUBLIC_PRODUCTS,
        label: "Productos",
        description: "Explorar el menú",
        icon: IconBurger,
        color: "blue",
      },
      {
        to: ROUTES.PUBLIC_INGREDIENTS,
        label: "Ingredientes",
        description: "Explora nuestros Ingredientes",
        icon: IconMeat,
        color: "orange",
      },
      {
        to: ROUTES.PROFILE,
        label: "Mi Perfil",
        description: "Ver y editar información personal",
        icon: IconUser,
        color: "teal",
      },
      {
        to: ROUTES.CHANGE_PASSWORD,
        label: "Contraseña",
        description: "Cambiar contraseña",
        icon: IconLock,
        color: "violet",
      },
    ],
  });

  if (roles.includes("CLIENT")) {
    sections.push({
      title: "Cliente",
      links: [
        {
          to: ROUTES.MY_ORDERS,
          label: "Mis Pedidos",
          description: "Ver historial de pedidos",
          icon: IconShoppingBag,
          color: "grape",
        },
      ],
    });
  }

  if (roles.includes("ADMIN")) {
    sections.push({
      title: "Administración",
      links: [
        {
          to: ROUTES.ADMIN_USERS,
          label: "Usuarios",
          description: "Gestionar usuarios del sistema",
          icon: IconUsers,
          color: "red",
        },
        {
          to: ROUTES.ADMIN_CATEGORIES,
          label: "Categorías",
          description: "Gestionar categorías",
          icon: IconCategory,
          color: "indigo",
        },
        {
          to: ROUTES.ADMIN_METRICS,
          label: "Métricas",
          description: "Ver métricas del sistema",
          icon: IconChartBar,
          color: "cyan",
        },
        {
          to: ROUTES.ADMIN_CONFIG,
          label: "Configuración",
          description: "Configuración del sistema",
          icon: IconSettings,
          color: "gray",
        },
      ],
    });
  }

  if (roles.includes("STOCK") || roles.includes("ADMIN")) {
    sections.push({
      title: "Stock",
      links: [
        {
          to: ROUTES.STOCK_INGREDIENTS,
          label: "Ingredientes",
          description: "Gestionar ingredientes",
          icon: IconEgg,
          color: "orange",
        },
        {
          to: ROUTES.STOCK_PRODUCTS,
          label: "Productos",
          description: "Gestionar productos",
          icon: IconPackage,
          color: "yellow",
        },
      ],
    });
  }

  if (roles.includes("ORDERS") || roles.includes("ADMIN")) {
    sections.push({
      title: "Órdenes",
      links: [
        {
          to: ROUTES.KITCHEN_BOARD,
          label: "Cocina",
          description: "Panel de cocina",
          icon: IconChefHat,
          color: "pink",
        },
        {
          to: ROUTES.ORDERS_ADMIN,
          label: "Pedidos",
          description: "Ver todas las órdenes",
          icon: IconClipboardList,
          color: "grape",
        },
      ],
    });
  }

  return sections;
};

export const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const sections = getQuickLinks(user.roles);
  const initials = `${user.name.charAt(0)}${user.lastname?.charAt(0) || ""}`;

  return (
    <Stack gap="lg">
      <Paper shadow="sm" withBorder radius="md" p="lg">
        <Group justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <Avatar color="teal" radius="xl" size="lg">
              {initials}
            </Avatar>
            <div>
              <Title order={3}>
                {user.name} {user.lastname}
              </Title>
              <Text size="sm" c="dimmed">
                {user.email}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            {user.roles.map((role) => {
              const config = roleConfig[role] || { label: role, color: "gray" };
              return (
                <Badge key={role} variant="light" color={config.color}>
                  {config.label}
                </Badge>
              );
            })}
          </Group>
        </Group>
      </Paper>

      <Title order={3}>Accesos Directos</Title>

      {sections.map(
        (section) =>
          section.links.length > 0 && (
            <div key={section.title}>
              <Title order={4} mb="sm">
                {section.title}
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {section.links.map((link) => (
                  <Card
                    key={link.to}
                    component={Link}
                    to={link.to}
                    withBorder
                    padding="md"
                    radius="md"
                    style={{ textDecoration: "none" }}
                  >
                    <Group wrap="nowrap">
                      <ThemeIcon
                        variant="light"
                        size="lg"
                        radius="md"
                        color={link.color}
                      >
                        <link.icon size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} c="dark">
                          {link.label}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {link.description}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>
            </div>
          ),
      )}
    </Stack>
  );
};
