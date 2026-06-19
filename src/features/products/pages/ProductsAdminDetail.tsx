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
  TextInput,
  Textarea,
  Title,
  Stack,
  ActionIcon,
  Image,
  SimpleGrid,
  FileInput,
} from "@mantine/core";
import { IconCheck, IconEdit, IconPhoto, IconTrash, IconX } from "@tabler/icons-react";
import {
  ProductCategoriesCard,
  ProductPriceCard,
  ProductSalesUnitCard,
  ProductStockCard,
  ProductTypeCard,
  ProductIngredientsCard,
} from "../components/ProductsDetailCards";
import { CategorySelector } from "../../categories/components/CategorySelector";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import NotFoundState from "../../../shared/components/NotFoundState";
import useImageUpload from "../../upload/hooks/useImageUpload";

const ProductsAdminDetail = () => {
  const { id } = useParams();
  const prodId = Number(id);

  const { data: product, isLoading } = useAdminProductDetail(prodId);
  const { changeStockAvailable, updateProduct, isUpdating } =
    useProductMutation();

  const { uploadImage, deleteImage, isUploading } = useImageUpload();

  const [localImages, setLocalImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalImages(product.images_url ?? []);
    }
  }, [product]);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<number | null>(null);

  if (!id || isNaN(prodId))
    return <NotFoundState message="Producto no encontrado" />;
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

  const startEditName = () => {
    setNameDraft(product.name);
    setEditingName(true);
  };

  const saveName = () => {
    if (!nameDraft.trim() || nameDraft === product.name) {
      setEditingName(false);
      return;
    }
    updateProduct(
      { id: prodId, data: { name: nameDraft } },
      {
        onSuccess: () => {
          setEditingName(false);
          notifications.show({ color: "green", message: "Nombre actualizado" });
        },
        onError: (err) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(err, "Error al actualizar"),
          });
        },
      },
    );
  };

  const startEditDesc = () => {
    setDescDraft(product.description ?? "");
    setEditingDesc(true);
  };

  const saveDesc = () => {
    if (descDraft === (product.description ?? "")) {
      setEditingDesc(false);
      return;
    }
    updateProduct(
      { id: prodId, data: { description: descDraft || undefined } },
      {
        onSuccess: () => {
          setEditingDesc(false);
          notifications.show({
            color: "green",
            message: "Descripción actualizada",
          });
        },
        onError: (err) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(err, "Error al actualizar"),
          });
        },
      },
    );
  };

  const startEditCategory = () => {
    setCategoryDraft(product.primary_category?.id ?? null);
    setEditingCategory(true);
  };

  const saveCategory = () => {
    if (categoryDraft === (product.primary_category?.id ?? null)) {
      setEditingCategory(false);
      return;
    }
    updateProduct(
      { id: prodId, data: { category_id: categoryDraft ?? 0 } },
      {
        onSuccess: () => {
          setEditingCategory(false);
          notifications.show({
            color: "green",
            message: "Categoría actualizada",
          });
        },
        onError: (err) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(err, "Error al actualizar"),
          });
        },
      },
    );
  };

  const handleAddImage = async (file: File | null) => {
    if (!file) return;
    try {
      const result = await uploadImage(file);
      setLocalImages((prev) => [...prev, result.url]);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractApiErrorMessage(error, "No se pudo subir la imagen"),
        color: "red",
      });
    }
  };

  const handleRemoveImage = async (url: string) => {
    try {
      const publicId = extractPublicId(url);
      if (publicId) await deleteImage(publicId);
    } catch {
      // si falla cleanup igual actualizamos la lista
    }
    setLocalImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSaveImages = () => {
    updateProduct(
      { id: prodId, data: { images_url: localImages } },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: "Imágenes actualizadas",
          });
        },
        onError: (err) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(err, "Error al actualizar imágenes"),
          });
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
              <div style={{ flex: 1 }}>
                <Text size="md">#{product.id}</Text>
                {editingName ? (
                  <Group gap="sm" mt="xs">
                    <TextInput
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.currentTarget.value)}
                      style={{ flex: 1 }}
                    />
                    <ActionIcon
                      color="teal"
                      onClick={saveName}
                      loading={isUpdating}
                    >
                      <IconCheck size={20} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => setEditingName(false)}
                    >
                      <IconX size={20} />
                    </ActionIcon>
                  </Group>
                ) : (
                  <Group gap="xs" align="center">
                    <Title order={2} mb="xs">
                      {product.name}
                    </Title>
                    <ActionIcon variant="subtle" onClick={startEditName}>
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Group>
                )}
                {editingDesc ? (
                  <Group gap="sm" mt="xs">
                    <Textarea
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.currentTarget.value)}
                      style={{ flex: 1 }}
                      minRows={2}
                    />
                    <ActionIcon
                      color="teal"
                      onClick={saveDesc}
                      loading={isUpdating}
                    >
                      <IconCheck size={20} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => setEditingDesc(false)}
                    >
                      <IconX size={20} />
                    </ActionIcon>
                  </Group>
                ) : (
                  <Group gap="xs" align="center">
                    <Text size="md">{product.description}</Text>
                    <ActionIcon variant="subtle" onClick={startEditDesc}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                )}
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
                placeholder="Agregar imagen"
                leftSection={<IconPhoto size={16} />}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAddImage}
                loading={isUploading}
                clearable
              />
              <Button
                size="xs"
                fullWidth
                onClick={handleSaveImages}
                loading={isUpdating}
              >
                Guardar imágenes
              </Button>
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
                <ActionIcon variant="subtle" onClick={startEditCategory}>
                  <IconEdit size={18} />
                </ActionIcon>
              </Group>
              {editingCategory ? (
                <Stack gap="sm">
                  <CategorySelector
                    label=""
                    value={categoryDraft}
                    onChange={(v) => setCategoryDraft(v)}
                    showBreadcrumbs
                    onlyLeaves
                  />
                  <Group gap="sm">
                    <Button
                      size="xs"
                      onClick={saveCategory}
                      loading={isUpdating}
                    >
                      Guardar
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => setEditingCategory(false)}
                    >
                      Cancelar
                    </Button>
                  </Group>
                </Stack>
              ) : (
                <Badge variant="filled" color="dark" size="lg">
                  {product?.primary_category?.name}
                </Badge>
              )}
            </Paper>
            <ProductCategoriesCard product={product} />
          </Stack>
        </Grid.Col>

        {product.type === "MANUFACTURED" && (
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

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
  return match?.[1] ?? null;
}

export default ProductsAdminDetail;
