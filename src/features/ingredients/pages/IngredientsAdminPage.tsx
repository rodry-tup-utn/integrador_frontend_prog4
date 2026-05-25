import { useState } from "react";
import {
  Table,
  TextInput,
  Button,
  Group,
  Title,
  Pagination,
  Paper,
  Text,
  SegmentedControl,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useAdminIngredientsList } from "../hooks/useAdminIngredientsList";
import { useIngredientMutations } from "../hooks/useIngredientMutations";
import { IngredientModal } from "../components/IngredientModal";
import { RowIngredient } from "../components/RowIngredient";
import { useAuth } from "../../auth/context/AuthContext";
import { notifications } from "@mantine/notifications";
import type { IngredientPrivate } from "../types/ingredient";
import { useDebouncedValue } from "@mantine/hooks";
export const IngredientsAdminPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ADMIN") || false;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allergenFilter, setAllergenFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<IngredientPrivate | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;
  const [debounsedSearch] = useDebouncedValue(searchTerm, 300);

  const filters = {
    search: debounsedSearch || undefined,
    is_allergen:
      allergenFilter === "all"
        ? undefined
        : allergenFilter === "allergen"
          ? true
          : false,
    offset: (page - 1) * limit,
    limit,
    sort_by: "name" as const,
    order: "asc" as const,
  };

  const { data: ingredients, isLoading } = useAdminIngredientsList(filters);
  const { deleteIngredient, restoreIngredient, isRestoring, isDeleting } =
    useIngredientMutations();
  const totalPages = ingredients ? Math.ceil(ingredients.total / limit) : 0;
  const handleDelete = async (id: number) => {
    try {
      await deleteIngredient(id);
      notifications.show({ color: "green", message: "Ingrediente eliminado" });
    } catch (e: any) {
      notifications.show({
        color: "red",
        message: e.response?.data?.detail || "Error",
      });
    }
  };
  const handleRestore = async (id: number) => {
    try {
      await restoreIngredient(id);
      notifications.show({ color: "cyan", message: "Ingrediente restaurado" });
    } catch (e: any) {
      notifications.show({
        color: "red",
        message: e.response?.data?.detail || "Error",
      });
    }
  };
  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Ingredientes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
        >
          Nuevo Ingrediente
        </Button>
      </Group>
      <TextInput
        placeholder="Buscar ingrediente..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.currentTarget.value);
          setPage(1);
        }}
        mb="md"
        maw={400}
      />
      <SegmentedControl
        value={allergenFilter}
        onChange={(v) => {
          setAllergenFilter(v);
          setPage(1);
        }}
        data={[
          { label: "Todos", value: "all" },
          { label: "Alérgenos", value: "allergen" },
          { label: "Seguros", value: "safe" },
        ]}
        mb="md"
      />
      <Paper shadow="sm" withBorder radius="md" mb="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th ta="center">Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="xl">
                    Cargando...
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (ingredients?.data?.length ?? 0) === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="xl">
                    No hay ingredientes.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              ingredients?.data.map((item) => (
                <RowIngredient
                  key={item.id}
                  item={item}
                  isAdmin={isAdmin}
                  onEdit={(id) => {
                    // find the ingredient from data and set it
                    const found = ingredients?.data.find(
                      (i) => i.id.toString() === id,
                    );
                    if (found) {
                      setSelectedItem(found);
                      setIsModalOpen(true);
                    }
                  }}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                  isDeleting={isDeleting}
                  isRestoring={isRestoring}
                />
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total: {ingredients?.total || 0}
        </Text>
        <Pagination total={totalPages || 1} value={page} onChange={setPage} />
      </Group>
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredientData={selectedItem}
        isDeleted={!!selectedItem?.deleted_at}
      />
    </>
  );
};
