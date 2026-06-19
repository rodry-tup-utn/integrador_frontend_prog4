import { useState } from "react";
import type { ProductPublic } from "../../features/products/types/product";
import { useCartStore } from "../../features/cart/store/cart.store";
import placeholder from "../../assets/placeholder.jpeg";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useAuth } from "../../features/auth/context/AuthContext";

const ProductCardPublic = ({ product }: { product: ProductPublic }) => {
  const { addItem, items } = useCartStore();
  const { user } = useAuth();
  const inCart = items.some((item) => item.product.id === product.id);
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.images_url?.filter(Boolean) ?? [];

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

        {images.length > 0 ? (
          <Box pos="relative">
            <Image
              src={images[imgIndex]}
              alt={product.name}
              h={140}
              fit="contain"
              radius="md"
            />

            {images.length > 1 && (
              <>
                <ActionIcon
                  variant="filled"
                  color="dark"
                  size="sm"
                  pos="absolute"
                  left={4}
                  top="50%"
                  style={{ transform: "translateY(-50%)", opacity: 0.8 }}
                  onClick={() =>
                    setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1))
                  }
                >
                  <IconChevronLeft size={14} />
                </ActionIcon>

                <ActionIcon
                  variant="filled"
                  color="dark"
                  size="sm"
                  pos="absolute"
                  right={4}
                  top="50%"
                  style={{ transform: "translateY(-50%)", opacity: 0.8 }}
                  onClick={() =>
                    setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1))
                  }
                >
                  <IconChevronRight size={14} />
                </ActionIcon>

                <Group
                  justify="center"
                  pos="absolute"
                  bottom={6}
                  left={0}
                  right={0}
                  gap={4}
                >
                  {images.map((_, i) => (
                    <UnstyledButton
                      key={i}
                      onClick={() => setImgIndex(i)}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background:
                          i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                        padding: 0,
                      }}
                    />
                  ))}
                </Group>
              </>
            )}
          </Box>
        ) : (
          <Image
            src={placeholder}
            alt={product.name}
            h={140}
            fit="cover"
            radius="md"
          />
        )}

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
