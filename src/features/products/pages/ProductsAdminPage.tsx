import {
  Group,
  Pagination,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconExclamationCircleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import ProductsTable from "../components/ProductsTable";
import { useAdminProducts } from "../hooks/product.queries.hooks";
import {
  productKeys,
  type ProductCreate,
  type ProductDetailResponse,
  type ProductFilters,
  type ProductPrivate,
  type TypeProduct,
} from "../types/product";
import ProductCreateModal from "../components/ProductCreateModal";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import ActionButton from "../../../shared/components/ActionButton";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { CategorySelector } from "../../categories/components/CategorySelector";
import { queryClient } from "../../../shared/api/queryClient";
import { productService } from "../services/product.services";

const ProductsAdminPage = () => {
  const LIMIT = 20;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);
  const [createOpen, setCreateOpen] = useState(false);
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [editingProductId, setEditingProductId] = useState<number | null>();
  const [prodToEdit, setProdToEdit] = useState<
    ProductDetailResponse | undefined
  >(undefined);
  const [typeFilter, setTypeFilter] = useState<TypeProduct | undefined>(
    undefined,
  );
  const [keepImages, setKeepImages] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId) {
      handleEdit(Number(editId));
      navigate("/admin/products", { replace: true });
    }
  }, [editId]);

  const filters: ProductFilters = {
    offset: (page - 1) * LIMIT,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    category_id: category,
    type: typeFilter,
  };

  const { data, isLoading } = useAdminProducts(filters);
  const {
    createProduct,
    deleteProduct,
    restoreProduct,
    updateProduct,
    updateIngredientsBatch,
    removeIngredient,
    isCreating,
  } = useProductMutation();

  const totalPages = data
    ? Math.ceil(data.total / (filters.limit ?? LIMIT))
    : 0;

  const handleDelete = (item: ProductPrivate) => {
    showConfirm({
      confirmLabel: "Eliminar",
      onConfirm: () => deleteProduct(item.id),
      title: `¿Eliminar el producto "${item.name}"`,
      color: "red",
      successMessage: `Producto ${item.name} eliminado correctamente`,
    });
  };

  const handleRestore = async (item: ProductPrivate) => {
    try {
      await restoreProduct(item.id);
      notifications.show({
        title: "Éxito",
        message: `Producto ${item.name} restaurado`,
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(
        error,
        `No se pudo restaurar el producto ${item.name}`,
      );
      notifications.show({
        message: msg,
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleCreate = (data: ProductCreate) => {
    createProduct(data, {
      onSuccess: () => {
        setKeepImages(true);
        setCreateOpen(false);
        notifications.show({
          title: "Producto creado",
          message: "Producto creado",
          color: "green",
          radius: "lg",
          icon: <IconCircleCheckFilled />,
        });
      },
      onError: (error) => {
        notifications.show({
          color: "red",
          message: extractApiErrorMessage(error, "Error al crear el producto"),
          radius: "lg",
          icon: <IconExclamationCircleFilled />,
        });
      },
    });
  };

  const handleEdit = async (data: number) => {
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: productKeys.getWithCategory(data),
        queryFn: () => productService.stock.getWithCategory(data),
      });
      setKeepImages(false);
      setEditingProductId(data);
      setProdToEdit(detail);
      setCreateOpen(true);
    } catch {
      notifications.show({
        title: "Error",
        message: "No se pudo cargar el producto",
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleModalClose = () => {
    setCreateOpen(false);
    setEditingProductId(null);
    setProdToEdit(undefined);
  };

  const handleSubmit = async (data: ProductCreate) => {
    if (!editingProductId) {
      handleCreate(data);
      return;
    }

    try {
      const { ingredients, ...productFields } = data;

      await updateProduct({ id: editingProductId, data: productFields });

      if (data.type === "MANUFACTURED") {
        if (ingredients.length > 0) {
          await updateIngredientsBatch({
            product_id: editingProductId,
            data: { ingredients },
          });
        }

        const originalIds = new Set(
          (prodToEdit?.ingredients ?? []).map((i) => i.ingredient_id),
        );
        const currentIds = new Set(ingredients.map((i) => i.ingredient_id));
        const removedIds = [...originalIds].filter((id) => !currentIds.has(id));

        await Promise.all(
          removedIds.map((id) =>
            removeIngredient({ productId: editingProductId, ingredientId: id }),
          ),
        );
      }
      setKeepImages(true);
      const msg = prodToEdit
        ? `${prodToEdit?.name} actualizado`
        : "Producto actualizado con éxito";
      handleModalClose();
      notifications.show({
        title: "Producto actualizado",
        message: msg,
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
    } catch (error) {
      notifications.show({
        title: "Error al actualizar",
        message: extractApiErrorMessage(
          error,
          "Error al actualizar el producto",
        ),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <Title order={2} style={{ marginBottom: "8px" }}>
        Productos
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Group justify="center" align="center" grow>
          <TextInput
            label="Buscar por nombre"
            placeholder="Buscar producto..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(evt) => {
              setSearchTerm(evt.currentTarget.value);
              setPage(1);
            }}
            w={"100%"}
          />

          <CategorySelector
            label="Filtrar por categoria"
            onChange={(value) => {
              setCategory(value || undefined);
            }}
            value={category}
          />

          <Select
            label="Tipo de producto"
            placeholder="Tipo..."
            clearable
            data={[
              { value: "MANUFACTURED", label: "Manufacturados" },
              { value: "FINAL", label: "Finales" },
            ]}
            onChange={(t) =>
              t ? setTypeFilter(t as TypeProduct) : setTypeFilter(undefined)
            }
          />
        </Group>

        <section className="cell py-2 px-4">
          <div className="flex items-center justify-center md:justify-end">
            <ActionButton
              icon={IconPlus}
              label="Nuevo Producto"
              text="Nuevo producto"
              onClick={() => {
                setKeepImages(false);
                setCreateOpen(true);
              }}
              color="teal"
              variant="filled"
            />
          </div>
        </section>

        <section className="cell md:col-span-2">
          <Paper shadow="sm" withBorder radius="md" p="md">
            <ProductsTable
              isLoading={isLoading}
              data={data}
              onModalOpen={setCreateOpen}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onEdit={handleEdit}
            />
          </Paper>
        </section>

        <section className="cell p-2" style={{ border: "2px doted green" }}>
          <div>
            <Text size="sm" c="dimmed">
              Total: {data?.total || 0}
            </Text>
          </div>
        </section>

        <section className="cell p-2" style={{ border: "2px doted green" }}>
          <div className="flex items-center justify-center md:justify-end">
            <Pagination
              total={totalPages || 1}
              value={page}
              onChange={setPage}
            />
          </div>
        </section>
      </div>
      {
        <ProductCreateModal
          key={prodToEdit?.name ?? "new"}
          opened={createOpen}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
          initialData={prodToEdit ?? undefined}
          keepImages={keepImages}
        />
      }
    </div>
  );
};

export default ProductsAdminPage;
