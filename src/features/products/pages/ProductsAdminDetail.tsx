import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
  ActionIcon,
  Image,
  SimpleGrid,
  FileInput,
} from "@mantine/core";
import { IconEdit, IconPhoto, IconTrash } from "@tabler/icons-react";
import {
  ProductCategoriesCard,
  ProductPriceCard,
  ProductSalesUnitCard,
  ProductStockCard,
  ProductTypeCard,
  ProductIngredientsCard,
} from "../components/ProductsDetailCards";
import ProductCreateModal from "../components/ProductCreateModal";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import NotFoundState from "../../../shared/components/NotFoundState";
import useImageUpload from "../../upload/hooks/useImageUpload";
import type { ProductCreate } from "../types/product";

const ProductsAdminDetail = () => {
  const { id } = useParams();
  const prodId = Number(id);

  const { data: product, isLoading } = useAdminProductDetail(prodId);
  const { updateProduct, isUpdating } = useProductMutation();

  const { uploadImage, deleteImage, isUploading } = useImageUpload();

  const [localImages, setLocalImages] = useState<string[]>([]);
  const [editModalOpened, setEditModalOpened] = useState(false);

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalImages(product.images_url ?? []);
    }
  }, [product]);

  const [fileKey, setFileKey] = useState(0);

  if (!id || isNaN(prodId))
    return <NotFoundState message="Producto no encontrado" />;
  if (isLoading) return <>Cargando...</>;
  if (!product) return <NotFoundState message="Producto no encontrado" />;

  const handleModalSubmit = (data: ProductCreate) => {
    updateProduct(
      { id: prodId, data },
      {
        onSuccess: () => {
          setEditModalOpened(false);
          notifications.show({
            color: "green",
            message: "Producto actualizado",
          });
        },
        onError: (error) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(error, "Error al actualizar"),
          });
        },
      },
    );
  };

  const handleAddImage = async (file: File | null) => {
    if (!file) return;
    try {
      const result = await uploadImage(file);
      const updatedImages = [...localImages, result.url];
      setLocalImages(updatedImages);
      updateProduct(
        { id: prodId, data: { images_url: updatedImages } },
        {
          onError: () => {
            setLocalImages(localImages);
          },
        },
      );
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractApiErrorMessage(error, "No se pudo subir la imagen"),
        color: "red",
      });
    } finally {
      setFileKey((k) => k + 1);
    }
  };

  const handleRemoveImage = async (url: string) => {
    const updatedImages = localImages.filter((u) => u !== url);
    setLocalImages(updatedImages);
    try {
      const publicId = extractPublicId(url);
      if (publicId) await deleteImage(publicId);
    } catch {
      // si falla cleanup igual continuamos
    }
    updateProduct(
      { id: prodId, data: { images_url: updatedImages } },
      {
        onError: () => {
          setLocalImages(localImages);
        },
      },
    );
  };

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
                onClick={() => setEditModalOpened(true)}
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
              {localImages.length > 0 ? (
                <SimpleGrid cols={2} spacing="sm">
                  {localImages.map((url) => (
                    <Stack key={url} gap={3} align="center">
                      <Image
                        src={url}
                        h={120}
                        w="auto"
                        fit="contain"
                        radius="sm"
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => handleRemoveImage(url)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Stack>
                  ))}
                </SimpleGrid>
              ) : (
                <Text size="sm" c="dimmed">
                  Sin imágenes
                </Text>
              )}
              <FileInput
                key={fileKey}
                placeholder="Agregar imagen"
                leftSection={<IconPhoto size={16} />}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAddImage}
                loading={isUploading}
                clearable
              />
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
            <ProductIngredientsCard ingredients={product.ingredients ?? []} />
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

      <ProductCreateModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        onSubmit={handleModalSubmit}
        isSubmitting={isUpdating}
        initialData={product}
      />
    </>
  );
};

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
  return match?.[1] ?? null;
}

export default ProductsAdminDetail;
