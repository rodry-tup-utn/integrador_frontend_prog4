import { useState } from "react";
import type { ProductPublic } from "../../features/products/types/product";
import { useCartStore } from "../../features/cart/store/cart.store";
import placeholder from "../../assets/placeholder.jpeg";
import { Badge, Button, Image, Paper, Stack, Text } from "@mantine/core";
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
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--mantine-radius-md)" }}>
            <div
              style={{
                display: "flex",
                transform: `translateX(-${imgIndex * 100}%)`,
                transition: "transform 0.3s ease",
              }}
            >
              {images.map((url) => (
                <div key={url} style={{ flex: "0 0 100%", minWidth: 0 }}>
                  <Image src={url} alt={product.name} h={140} fit="cover" />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1))
                  }
                  style={{
                    position: "absolute",
                    left: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                    opacity: 0.8,
                    transition: "opacity 0.2s",
                  }}
                >
                  <IconChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1))
                  }
                  style={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                    opacity: 0.8,
                    transition: "opacity 0.2s",
                  }}
                >
                  <IconChevronRight size={16} />
                </button>

                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 5,
                  }}
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      aria-label={`Imagen ${i + 1}`}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                        transition: "background 0.2s",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <Image src={placeholder} alt={product.name} h={140} fit="cover" radius="md" />
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
