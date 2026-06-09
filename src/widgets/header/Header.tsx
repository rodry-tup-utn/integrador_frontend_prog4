import { Group, Button, Text, ThemeIcon, Burger } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import { useAuth } from "../../features/auth/context/AuthContext";
import { IconSoup, IconHome, IconArrowLeft } from "@tabler/icons-react";
import ActionButton from "../../shared/components/ActionButton";

interface HeaderProps {
  toggle: () => void;
  mobileOpened: boolean;
}

const Header = ({ toggle, mobileOpened }: HeaderProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      {/* Izquierda: Burger + Logo + Home */}
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
        {isAuthenticated && (
          <ActionButton
            onClick={() => navigate(ROUTES.HOME)}
            label="Dashboard"
            icon={IconHome}
            text="Home"
            color="cyan"
            variant="subtle"
          />
        )}
      </Group>

      <Group gap="sm">
        <ActionButton
          onClick={() => navigate(-1)}
          label="Volver"
          icon={IconArrowLeft}
          variant="subtle"
          color="cyan"
          text="Volver"
        />
        {!isAuthenticated && (
          <>
            <Button component={Link} to={ROUTES.LOGIN} variant="light">
              Iniciar sesión
            </Button>
            <Button component={Link} to={ROUTES.REGISTER}>
              Registrarse
            </Button>
          </>
        )}
      </Group>
    </Group>
  );
};
export default Header;
