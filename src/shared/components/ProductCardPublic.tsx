import type { ProductPublic } from "../../features/products/types/product";
import { useCartStore } from "../../features/cart/store/cart.store";
import placeholder from "../../assets/placeholder.jpeg";
import { Badge, Button, Image, Paper, Stack, Text } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { useAuth } from "../../features/auth/context/AuthContext";

const ProductCardPublic = ({ product }: { product: ProductPublic }) => {
  const { addItem, items } = useCartStore();
  const { user } = useAuth();
  const inCart = items.some((item) => item.product.id === product.id);

  const canAdd =
    !user || user.roles.includes("CLIENT") || user.roles.includes("ADMIN");

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Stack h="100%" gap="sm">
        {/* renderizado condicional segun cantidad de stock */}
        {(() => {
          const stockState =
            !product.available || product.stock === 0 || product.stock === null
              ? "out"
              : product.stock < 8
                ? "last"
                : "available";

          const config = {
            out: { color: "red", label: "Sin stock" },
            last: { color: "orange", label: "Últimas unidades" },
            available: { color: "teal", label: "Disponible" },
          } as const;

          const current = config[stockState];

          return (
            <Badge
              color={current.color}
              variant="light"
              style={{ whiteSpace: "nowrap" }}
            >
              {current.label}
            </Badge>
          );
        })()}

        <Image
          src={placeholder}
          alt={product.name}
          h={140}
          fit="cover"
          radius="md"
        />

        <Stack gap={4} style={{ flex: 1 }}>
          <Text fw={600} size="sm" lineClamp={2}>
            {product.name}
          </Text>
          {product.description && (
            <Text size="xs" c="dimmed" lineClamp={2}>
              {product.description}
            </Text>
          )}
        </Stack>

        <Text fw={700} size="lg" c="teal" ta="center">
          ${Number(product.base_price).toLocaleString("es-AR")}
        </Text>

        {canAdd && (
          <Button
            size="xs"
            variant={inCart ? "light" : "filled"}
            color="teal"
            fullWidth
            leftSection={<IconShoppingCart size={14} />}
            disabled={!product.available || product.stock === 0}
            onClick={() => addItem(product)}
          >
            {inCart ? "+ Agregar más" : "+ Agregar"}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default ProductCardPublic;
