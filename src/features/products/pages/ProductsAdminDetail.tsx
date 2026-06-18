import { useParams } from "react-router-dom";
import { useState } from "react";
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
} from "@mantine/core";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import {
  ProductCategoriesCard,
  ProductImageCard,
  ProductPriceCard,
  ProductStockCard,
  ProductTypeCard,
  ProductIngredientsCard,
} from "../components/ProductsDetailCards";
import { CategorySelector } from "../../categories/components/CategorySelector";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import NotFoundState from "../../../shared/components/NotFoundState";
import UploadFile from "../../../widgets/uploadFile/UploadFile";

const ProductsAdminDetail = () => {
  const { id } = useParams();
  const prodId = Number(id);

  const { data: product, isLoading } = useAdminProductDetail(prodId);
  const { changeStockAvailable, updateProduct, isUpdating } =
    useProductMutation();

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<number | null>(null);
  const [openUpload, setOpenUpload] = useState(false);

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
            <Button
              variant="subtle"
              size="sm"
              fullWidth
              mt="sm"
              onClick={() => setOpenUpload(true)}
            >
              Cambiar imagen
            </Button>
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
      <UploadFile
        open={openUpload}
        type="product"
        handleClose={() => setOpenUpload(false)}
        id={prodId}
        currentImageUrl={product.images_url}
      />
    </>
  );
};

export default ProductsAdminDetail;
