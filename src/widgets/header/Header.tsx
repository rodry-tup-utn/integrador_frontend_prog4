import { Group, Button, Text, ThemeIcon, Burger } from "@mantine/core";
import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import { useAuth } from "../../features/auth/context/AuthContext";
import { IconSoup } from "@tabler/icons-react";

interface HeaderProps {
  toggle: () => void;
  mobileOpened: boolean;
}

const Header = ({ toggle, mobileOpened }: HeaderProps) => {
  const { isAuthenticated } = useAuth();
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      {/* Izquierda: Burger + Logo */}
      <Group gap="xs" wrap="nowrap">
        {isAuthenticated && (
          <Burger opened={mobileOpened} onClick={toggle} hiddenFrom="sm" />
        )}
        <ThemeIcon size="lg" radius="md" color="teal">
          <IconSoup size={20} />
        </ThemeIcon>
        <Text
          component={Link}
          to={ROUTES.LANDING}
          size="xl"
          fw={800}
          c="teal.8"
        >
          Food Store
        </Text>
      </Group>

      {!isAuthenticated && (
        <Group gap="sm">
          <Button component={Link} to={ROUTES.LOGIN} variant="light">
            Iniciar sesión
          </Button>
          <Button component={Link} to={ROUTES.REGISTER}>
            Registrarse
          </Button>
        </Group>
      )}
    </Group>
  );
};
export default Header;
