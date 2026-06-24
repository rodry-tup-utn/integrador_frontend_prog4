import {
  Group,
  Button,
  Text,
  ThemeIcon,
  Burger,
  Indicator,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import { useAuth } from "../../features/auth/context/AuthContext";
import {
  IconShoppingCart,
  IconSoup,
  IconHome,
  IconArrowLeft,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import CartDrawer from "../../features/cart/components/CartDrawer";
import { useDisclosure } from "@mantine/hooks";
import { useCartStore } from "../../features/cart/store/cart.store";
import ActionButton from "../../shared/components/ActionButton";

interface HeaderProps {
  toggle: () => void;
  toggleDesktop: () => void;
  desktopOpened: boolean;
  mobileOpened: boolean;
}

const Header = ({
  toggle,
  toggleDesktop,
  desktopOpened,
  mobileOpened,
}: HeaderProps) => {
  const { isAuthenticated } = useAuth();
  const [cartOpened, { open: openCart, close: closeCart }] =
    useDisclosure(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();
  const { user } = useAuth();
  const seeCart =
    !user || user.roles.includes("CLIENT") || user.roles.includes("ADMIN");

  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      {/* Izquierda: Burger + Logo + Home */}
      <Group gap="xs" wrap="nowrap">
        {isAuthenticated && (
          <Burger opened={mobileOpened} onClick={toggle} hiddenFrom="sm" />
        )}
        {isAuthenticated && (
          <Tooltip
            label={desktopOpened ? "Colapsar sidebar" : "Expandir sidebar"}
          >
            <ActionIcon
              onClick={toggleDesktop}
              variant="subtle"
              color="teal"
              size="lg"
              visibleFrom="sm"
            >
              {desktopOpened ? (
                <IconLayoutSidebarLeftCollapse size={20} />
              ) : (
                <IconLayoutSidebarLeftExpand size={20} />
              )}
            </ActionIcon>
          </Tooltip>
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
            text="Dashboard"
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

        {seeCart && (
          <Group mr="md">
            <Indicator
              label={totalItems}
              size={16}
              color="teal"
              disabled={totalItems === 0}
            >
              <ActionIcon variant="subtle" onClick={openCart} size="lg">
                <IconShoppingCart size={22} />
              </ActionIcon>
            </Indicator>

            <CartDrawer opened={cartOpened} onClose={closeCart} />
          </Group>
        )}
      </Group>
    </Group>
  );
};
export default Header;
