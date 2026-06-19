import { Group, Pagination, Text, TextInput, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import ProductsTable from "../components/ProductsTable";
import { useAdminProducts } from "../hooks/product.queries.hooks";
import {
  type ProductCreate,
  type ProductFilters,
  type ProductPrivate,
} from "../types/product";
import ProductCreateModal from "../components/ProductCreateModal";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import ActionButton from "../../../shared/components/ActionButton";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { CategorySelector } from "../../categories/components/CategorySelector";

const ProductsAdminPage = () => {
  const LIMIT = 20;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);
  const [createOpen, setCreateOpen] = useState(false);
  const [category, setCategory] = useState<number | undefined>(undefined);

  const filters: ProductFilters = {
    offset: (page - 1) * LIMIT,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    category_id: category,
  };

  const { data, isLoading } = useAdminProducts(filters);
  const { createProduct, deleteProduct, restoreProduct, isCreating } =
    useProductMutation();

  const totalPages = data
    ? Math.ceil(data.total / (filters.limit ?? LIMIT))
    : 0;

  const handleDelete = (item: ProductPrivate) => {
    showConfirm({
      confirmLabel: "Eliminar",
      onConfirm: () => deleteProduct(item.id),
      title: `Eliminar el producto ${item.name}`,
      color: "red",
      successMessage: `Producto ${item.name} eliminado correctamente`,
    });
  };

  const handleRestore = (item: ProductPrivate) => {
    showConfirm({
      confirmLabel: "Restaurar",
      onConfirm: () => restoreProduct(item.id),
      title: `Restaurar el producto ${item.name}`,
      color: "teal",
      successMessage: `Producto ${item.name} restaurado correctamente`,
    });
  };

  const handleCreate = (data: ProductCreate) => {
    createProduct(data, {
      onSuccess: () => {
        setCreateOpen(false);
        notifications.show({ color: "green", message: "Producto creado" });
      },
      onError: (error) => {
        notifications.show({
          color: "red",
          message: extractApiErrorMessage(error, "Error al crear el producto"),
        });
      },
    });
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
        </Group>

        <section className="cell py-2 px-4">
          <div className="flex items-center justify-center md:justify-end">
            <ActionButton
              icon={IconPlus}
              label="Nuevo Producto"
              text="Nuevo producto"
              onClick={() => setCreateOpen(true)}
              color="teal"
              variant="filled"
            />
          </div>
        </section>

        <section className="cell md:col-span-2">
          <div className="flex flex-col items-start justify-between min-h-50 p-2 shadow-md border-b-gray-400 rounded-md">
            <ProductsTable
              isLoading={isLoading}
              data={data}
              onModalOpen={setCreateOpen}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          </div>
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
      <ProductCreateModal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default ProductsAdminPage;
