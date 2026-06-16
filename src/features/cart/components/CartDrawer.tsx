import {
  Drawer,
  Text,
  Button,
  ActionIcon,
  Divider,
  Badge,
  NumberInput,
} from "@mantine/core";
import { IconTrash, IconShoppingCart } from "@tabler/icons-react";
import { useCartStore } from "../store/cart.store";
import { useAuth } from "../../auth/context/AuthContext";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { ROUTES } from "../../../shared/constants/routes";

interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
}

const CartDrawer = ({ opened, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleConfirm = () => {
    onClose();

    if (!isAuthenticated) {
      showConfirm({
        title: "Debes iniciar sesión para realizar un pedido",
        confirmLabel: "Iniciar sesión",
        successMessage: "",
        color: "orange",
        onConfirm: async () => navigate(ROUTES.LOGIN),
      });
      return;
    }

    if (!user?.roles.includes("CLIENT")) {
      notifications.show({
        title: "Acción no permitida",
        message: "Solo los clientes pueden realizar pedidos",
        color: "orange",
      });
      return;
    }

    navigate(ROUTES.CHECKOUT);
  };

  const total = getTotalPrice();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <IconShoppingCart size={20} />
          <Text fw={700} size="lg">
            Tu pedido
          </Text>
          {items.length > 0 && (
            <Badge color="teal" variant="filled" size="sm">
              {items.length}
            </Badge>
          )}
        </div>
      }
      position="right"
      size="md"
    >
      <div className="flex flex-col h-full gap-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
            <IconShoppingCart size={48} stroke={1} />
            <Text size="sm">Tu carrito está vacío</Text>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 p-3 border border-solid border-zinc-300 rounded-2xl bg-slate-100"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <Text size="sm" fw={600} truncate>
                      {product.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ${Number(product.base_price).toLocaleString("es-AR")} c/u
                    </Text>
                  </div>

                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={quantity}
                      onChange={(val) =>
                        updateQuantity(product.id, Number(val))
                      }
                      min={0}
                      max={product.stock}
                      w={80}
                      size="xs"
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeItem(product.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </div>
                </div>
              ))}
            </div>

            <Divider />
            <div className="flex items-center justify-between px-1">
              <Text fw={600}>Total</Text>
              <Text fw={700} size="lg" c="teal">
                ${Number(total).toLocaleString("es-AR")}
              </Text>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <Button fullWidth size="md" onClick={handleConfirm}>
                Confirmar pedido
              </Button>
              <Button
                fullWidth
                variant="subtle"
                color="red"
                size="sm"
                onClick={clearCart}
              >
                Vaciar carrito
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
