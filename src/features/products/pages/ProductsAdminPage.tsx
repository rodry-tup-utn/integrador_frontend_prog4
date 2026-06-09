import { Pagination, Text, TextInput, Title } from "@mantine/core";
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
import ProductsModal from "../components/ProductsModal";
import ProductsForm from "../components/ProductsForm";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import type { AxiosError } from "axios";
import ActionButton from "../../../shared/components/ActionButton";
import { showConfirm } from "../../../shared/components/ShowConfirm";

const ProductsAdminPage = () => {
  const LIMIT = 20;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);
  const [editing, setEditing] = useState<ProductPrivate | null>(null);
  const [open, setOpen] = useState(false);

  const filters: ProductFilters = {
    offset: (page - 1) * LIMIT,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useAdminProducts(filters);
  const { createProduct, updateProduct, deleteProduct, restoreProduct } =
    useProductMutation();

  const totalPages = data
    ? Math.ceil(data.total / (filters.limit ?? LIMIT))
    : 0;

  const handleEdit = (item: ProductPrivate) => {
    setEditing(item);
    setOpen(true);
  };

  const handleDelete = (item: ProductPrivate) => {
    showConfirm({
      confirmLabel: "Eliminar",
      onConfirm: () => deleteProduct(item.id),
      title: `Eliminar el producto ${item.name}`,
      color: "red",
      successMessage: `Producto ${item.name} eliminado correctament`,
    });
  };

  const handleRestore = (item: ProductPrivate) => {
    showConfirm({
      confirmLabel: "Restaurar",
      onConfirm: () => restoreProduct(item.id),
      title: `Restaurar el producto ${item.name}`,
      color: "teal",
      successMessage: `Producto ${item.name} restaurado correctament`,
    });
  };

  const handleClose = () => {
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = (data: ProductCreate) => {
    if (editing) {
      updateProduct(
        { id: editing!.id, data },
        {
          onSuccess: () => {
            setOpen(false);
            setEditing(null);
            notifications.show({
              color: "green",
              message: "Producto actualizado",
            });
          },
          onError: (error) => {
            const axiosError = error as AxiosError<{ detail: string }>;
            const msg =
              axiosError.response?.data?.detail || "Error al actualizar";
            notifications.show({ color: "red", message: msg });
          },
        },
      );
    } else {
      createProduct(data, {
        onSuccess: () => {
          setOpen(false);
          setEditing(null);
          notifications.show({ color: "green", message: "Producto creado" });
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ detail: string }>;
          const msg =
            axiosError.response?.data?.detail || "Error al crear el producto";
          notifications.show({ color: "red", message: msg });
        },
      });
    }
  };

  return (
    <div className="flex flex-col">
      <Title order={2} style={{ marginBottom: "8px" }}>
        Productos
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        El stock de productos manufacturados es aproximado. Consulte el detalle
        para ver el stock real.
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="cell p-2">
          <div className="flex items-center justify-center md:justify-start">
            <TextInput
              placeholder="Buscar producto..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(evt) => {
                setSearchTerm(evt.currentTarget.value);
                setPage(1);
              }}
              w={"100%"}
            />
          </div>
        </section>

        <section className="cell py-2 px-4">
          <div className="flex items-center justify-center md:justify-end">
            <ActionButton
              icon={IconPlus}
              label="Nuevo Producto"
              text="Nuevo producto"
              onClick={() => setOpen(true)}
              color="teal"
              variant="filled"
            ></ActionButton>
          </div>
        </section>

        <section className="cell md:col-span-2">
          <div className="flex flex-col items-start justify-between min-h-50 p-2 shadow-md border-b-gray-400 rounded-md">
            <ProductsTable
              isLoading={isLoading}
              data={data}
              onEdit={handleEdit}
              onModalOpen={setOpen}
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
      <ProductsModal open={open} handleClose={handleClose}>
        <ProductsForm
          handleClose={handleClose}
          editing={editing}
          key={editing?.id ?? "new"}
          onSubmit={handleSubmit}
        />
      </ProductsModal>
    </div>
  );
};

export default ProductsAdminPage;
