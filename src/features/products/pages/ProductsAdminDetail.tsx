import { useParams, useNavigate } from "react-router-dom";
import {
  useAdminProductDetail,
  useProductWithIngredients,
} from "../hooks/product.queries.hooks";
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
  Image,
  SimpleGrid,
} from "@mantine/core";
import {
  ProductCategoriesCard,
  ProductPriceCard,
  ProductSalesUnitCard,
  ProductStockCard,
  ProductTypeCard,
  ProductIngredientsCard,
} from "../components/ProductsDetailCards";
import { IconEdit } from "@tabler/icons-react";
import NotFoundState from "../../../shared/components/NotFoundState";
import placeholder from "../../../assets/placeholder.jpeg";

const ProductsAdminDetail = () => {
  const { id } = useParams();
  const prodId = Number(id);

  const { data: product, isLoading } = useAdminProductDetail(prodId);
  const { data: productIngredients } = useProductWithIngredients(prodId);
  const navigate = useNavigate();

  if (!id || isNaN(prodId))
    return <NotFoundState message="Producto no encontrado" />;
  if (isLoading) return <>Cargando...</>;
  if (!product) return <NotFoundState message="Producto no encontrado" />;

  return (
    <>
      <Grid gap="lg" p="md">
        <Grid.Col span={12}>
          <Paper
            p="md"
            withBorder
            className="bg-slate-100 rounded-2xl border-zinc-500"
          >
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text size="sm" c="dimmed">
                  #{product.id}
                </Text>
                <Group gap="xs" align="center">
                  <Title order={2}>{product.name}</Title>
                  <Badge
                    color={product.available ? "teal" : "red"}
                    variant="dot"
                    size="lg"
                  >
                    {product.available ? "Disponible" : "No disponible"}
                  </Badge>
                </Group>
                {product.description && (
                  <Text size="md">{product.description}</Text>
                )}
              </Stack>
              <Button
                leftSection={<IconEdit size={18} />}
                onClick={() => navigate("/admin/products?edit=" + prodId)}
              >
                Editar producto
              </Button>
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
              <ProductSalesUnitCard product={product} />
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            p="md"
            withBorder
            className="bg-slate-100 rounded-2xl border-zinc-500"
          >
            <Stack gap="sm">
              <Text size="md" fw={700}>
                Imágenes
              </Text>
              {product.images_url && product.images_url.length > 0 ? (
                <SimpleGrid cols={2} spacing="sm">
                  {product.images_url.map((url: string) => (
                    <Stack key={url} gap={3} align="center">
                      <Image
                        src={url}
                        h={120}
                        w="auto"
                        fit="contain"
                        radius="sm"
                      />
                    </Stack>
                  ))}
                </SimpleGrid>
              ) : (
                <Image
                  src={placeholder}
                  h={120}
                  w="auto"
                  fit="contain"
                  radius="sm"
                ></Image>
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap={5}>
            <ProductTypeCard product={product} />
            <Paper
              p="md"
              withBorder
              className="bg-slate-100 rounded-2xl border-zinc-500"
            >
              <Group justify="space-between" align="center" mb="sm">
                <Text size="md">Categoría principal</Text>
              </Group>
              <Badge variant="filled" color="dark" size="lg">
                {product?.primary_category?.name}
              </Badge>
            </Paper>
            <ProductCategoriesCard product={product} />
          </Stack>
        </Grid.Col>

        {product.type === "MANUFACTURED" && (
          <Grid.Col span={12}>
            <ProductIngredientsCard
              ingredients={productIngredients?.ingredients ?? []}
            />
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
