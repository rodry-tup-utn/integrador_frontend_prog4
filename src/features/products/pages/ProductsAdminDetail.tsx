import { useNavigate, useParams } from "react-router-dom";
import { useAdminProductDetail } from "../hooks/product.queries.hooks";
import {
  Badge,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  Stack,
} from "@mantine/core";
import {
  ProductCategoriesCard,
  ProductImageCard,
  ProductPriceCard,
  ProductStockCard,
  ProductTypeCard,
  ProductIngredientsCard,
} from "../components/ProductsDetailCards";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import { CircleArrowLeftIcon } from "lucide-react";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import NotFoundState from "../../../shared/components/NotFoundState";

const ProductsAdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const prodId = Number(id);

  const { data: product, isLoading } = useAdminProductDetail(prodId);

  const { changeStockAvailable } = useProductMutation();

  if (!id || isNaN(prodId)) return <NotFoundState message="Producto no encontrado" />;
  if (isLoading) return <>Cargando...</>;
  if (!product) return <NotFoundState message="Producto no encontrado" />;

  const handleAvailability = (availability: boolean) => {
    changeStockAvailable(
      { id: prodId, is_available: availability },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: "Disponibilidad actualizada",
          });
        },
        onError: (error) => {
          const message = extractApiErrorMessage(error);

          notifications.show({ color: "red", message: message });
        },
      },
    );
  };

  return (
    <>
      <Group px="md">
        <Button
          onClick={() => navigate("/stock/products")}
          size="lg"
          variant="subtle"
          color="cyan"
          leftSection={<CircleArrowLeftIcon size={28} />}
        >
          Volver
        </Button>
      </Group>

      <Grid gap="lg" p="md">
        <Grid.Col span={12}>
          <Paper
            p="md"
            withBorder
            className="bg-slate-100 rounded-2xl border-zinc-500"
          >
            <Group justify="space-between" align="center">
              <div>
                <Text size="md">#{product.id}</Text>
                <Title order={2} mb="xs">
                  {product.name}
                </Title>
                <Text size="md">{product.description}</Text>
              </div>
              <Badge
                color={product.available ? "teal" : "red"}
                variant="dot"
                size="lg"
                style={{ cursor: "pointer" }}
                onClick={() => handleAvailability(!product.available)}
              >
                {product.available ? "Disponible" : "No disponible"}
              </Badge>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <ProductPriceCard product={product} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <ProductStockCard product={product} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Paper
                p="md"
                withBorder
                className="bg-slate-100 rounded-2xl border-zinc-500"
              >
                <Text size="md">Categorías</Text>
                <Text size="xl" fw={500}>
                  {product.categories?.length ?? 0}
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            p="md"
            withBorder
            className="bg-slate-100 rounded-2xl border-zinc-500"
          >
            <ProductImageCard product={product} />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap={5}>
            <ProductTypeCard product={product} />
            <ProductCategoriesCard product={product} />
          </Stack>
        </Grid.Col>

        {product.type == "MANUFACTURED" && (
          <Grid.Col span={12}>
            <Paper
              p="md"
              withBorder
              className="bg-slate-100 rounded-2xl border-zinc-500"
            >
              <ProductIngredientsCard productId={product.id} />
            </Paper>
          </Grid.Col>
        )}

        <Grid.Col span={12}>
          <Paper
            p="md"
            withBorder
            className="bg-slate-100 rounded-2xl border-zinc-500"
          >
            <Text size="md" fw={800}>
              Auditoría
            </Text>
            <Divider mx="sm" />
            <Group justify="space-between">
              <Text>Creado</Text>
              <span>
                {new Date(product.created_at).toLocaleString("es-AR")}
              </span>
            </Group>
            <Divider mx="sm" />
            <Group justify="space-between">
              <Text>Actualizado</Text>
              <span>
                {product.updated_at
                  ? new Date(product.updated_at).toLocaleString("es-AR")
                  : "—"}
              </span>
            </Group>
            <Divider mx="sm" />
            <Group justify="space-between">
              <Text>Eliminado</Text>
              <Badge
                color={product.deleted_at ? "red" : "teal"}
                variant="dot"
                size="lg"
              >
                {product.deleted_at
                  ? new Date(product.deleted_at).toLocaleString("es-AR")
                  : "No"}
              </Badge>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default ProductsAdminDetail;
