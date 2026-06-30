import { useState } from "react";
import { usePublicProducts } from "../../features/products/hooks/product.queries.hooks";
import {
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  NumberInput,
  Select,
  Center,
} from "@mantine/core";
import {
  IconSearch,
  IconShoppingCartOff,
  IconArrowLeft,
} from "@tabler/icons-react";
import ProductCardPublic from "../../shared/components/ProductCardPublic";
import { useDebouncedValue } from "@mantine/hooks";
import { useCategoryTree } from "../../features/categories/hooks/useCategoryTree";
import type { CategoryNode } from "../../features/categories/types/category";
import type { OrderDirection } from "../../features/orders/types/order";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "base_price-asc", label: "Precio menor a mayor" },
  { value: "base_price-desc", label: "Precio mayor a menor" },
] as const;

function findNode(tree: CategoryNode[], id: number): CategoryNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children.length > 0) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const [categoryStack, setCategoryStack] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortValue: null as string | null,
  });

  const { data: categoryTree } = useCategoryTree(4);

  const selectedCategoryId =
    categoryStack.length > 0 ? categoryStack[categoryStack.length - 1] : null;

  const currentCategories =
    categoryStack.length === 0
      ? (categoryTree ?? [])
      : (findNode(categoryTree ?? [], categoryStack[categoryStack.length - 1])
        ?.children ?? []);

  const [sortBy, order]: [string | undefined, OrderDirection | undefined] =
    filters.sortValue
      ? (filters.sortValue.split("-") as [string, OrderDirection])
      : [undefined, undefined];

  const { data: productsList, isLoading } = usePublicProducts({
    search: debouncedSearch.trim() || undefined,
    category_id: selectedCategoryId || undefined,
    min_price: filters.minPrice ? Number(filters.minPrice) : undefined,
    max_price: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    sort_by: (sortBy as "name" | "base_price") || undefined,
    order: order || undefined,
    offset: 0,
    limit: 50,
  });

  const visibleProducts = productsList?.data ?? [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Text size="xl" fw={800} c="teal.8">
            Nuestros productos
          </Text>
          <Text size="sm" c="dimmed">
            {visibleProducts.length ?? 0} productos disponibles
          </Text>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <TextInput
          placeholder="Buscar productos..."
          leftSection={<IconSearch size={20} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="max-w-sm"
        />

        <NumberInput
          placeholder="Precio min"
          value={filters.minPrice}
          onChange={(v) =>
            setFilters((prev) => ({ ...prev, minPrice: String(v) }))
          }
          min={0}
          w={120}
          size="sm"
          hideControls
        />

        <NumberInput
          placeholder="Precio max"
          value={filters.maxPrice}
          onChange={(v) =>
            setFilters((prev) => ({ ...prev, maxPrice: String(v) }))
          }
          min={0}
          w={120}
          size="sm"
          hideControls
        />

        <Select
          placeholder="Ordenar por"
          data={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={filters.sortValue}
          onChange={(v) => setFilters((prev) => ({ ...prev, sortValue: v }))}
          clearable
          w={200}
          size="sm"
        />

        <Button
          variant="light"
          color="gray"
          size="sm"
          onClick={() => {
            setFilters({ minPrice: "", maxPrice: "", sortValue: null });
            setSearch("");
            setCategoryStack([]);
          }}
        >
          Limpiar filtros
        </Button>
      </div>

      <Center>
        <Stack gap="sm" align="center">
          <Group gap="md" justify="center" wrap="wrap">
            {categoryStack.length > 0 && (
              <Button
                size="sm"
                radius="xl"
                variant="subtle"
                color="blue"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => setCategoryStack((prev) => prev.slice(0, -1))}
              >
                Volver
              </Button>
            )}
            {currentCategories.map((cat) => (
              <Button
                key={cat.id}
                size="md"
                radius="xl"
                color="teal"
                variant={selectedCategoryId === cat.id ? "filled" : "outline"}
                onClick={() => setCategoryStack((prev) => [...prev, cat.id])}
              >
                {cat.name}
              </Button>
            ))}
            {categoryStack.length > 0 && (
              <Button
                size="sm"
                radius="xl"
                variant="subtle"
                color="blue"
                onClick={() => setCategoryStack([])}
              >
                Todas
              </Button>
            )}
          </Group>
        </Stack>
      </Center>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Text c="dimmed">Cargando productos...</Text>
        </div>
      ) : visibleProducts && visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleProducts.map((product) => (product.available && product.stock > 0) && (
            <ProductCardPublic key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
          <IconShoppingCartOff size={48} stroke={1} />
          <Text size="sm">No se encontraron productos</Text>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
