import { Group, Button, Text, ThemeIcon, Burger, Indicator, ActionIcon } from "@mantine/core";
import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import { useAuth } from "../../features/auth/context/AuthContext";
import { IconShoppingCart, IconSoup } from "@tabler/icons-react";
import CartDrawer from "../../features/cart/components/CartDrawer";
import { useDisclosure } from "@mantine/hooks";
import { useCartStore } from "../../features/cart/store/cart.store";

interface HeaderProps {
  toggle: () => void;
  mobileOpened: boolean;
}

const Header = ({ toggle, mobileOpened }: HeaderProps) => {
  const { isAuthenticated, user } = useAuth();
  const [cartOpened, { open: openCart, close: closeCart }] = useDisclosure(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const isClient = user?.roles.includes("CLIENT")

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
      {
        (isAuthenticated && isClient) && (
          <>
            <Indicator label={totalItems} size={16} color="teal" disabled={totalItems === 0}>
              <ActionIcon variant="subtle" onClick={openCart} size="lg">
                <IconShoppingCart size={22} />
              </ActionIcon>
            </Indicator>

            <CartDrawer opened={cartOpened} onClose={closeCart} />
          </>
        )
      }
    </Group>
  );
};
export default Header;
