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
  Badge,
} from "@mantine/core";
import { IconSearch, IconPlus, IconEdit } from "@tabler/icons-react";
import { useAdminCategoryList } from "../hooks/useAdminCategoryList";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import type { CategoryPrivate } from "../types/category";
import { useDebouncedValue } from "@mantine/hooks";
import { CategoryCreateModal } from "../components/CategoryCreateModal";
import { CategoryEditModal } from "../components/CategoryEditModal";
import { showConfirm } from "../../../shared/components/ShowConfirm";
export default function CategoriesAdminPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryPrivate | null>(null);
  const [debounsedSearch] = useDebouncedValue(searchTerm, 300);
  const limit = 10;
  const { data, isLoading } = useAdminCategoryList(
    (page - 1) * limit,
    limit,
    debounsedSearch,
  );
  const { deleteCategory, restoreCategory } = useCategoryMutations();
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleDelete = (item: CategoryPrivate) => {
    showConfirm({
      title: "Eliminar categoria?",
      color: "red",
      confirmLabel: "Eliminar",
      onConfirm: () => deleteCategory(item.id),
      successMessage: `Categoría ${item.name} eliminada`,
    });
  };

  const handleRestore = (item: CategoryPrivate) => {
    showConfirm({
      title: "¿Restaurar categoria?",
      confirmLabel: "Restaurar",
      color: "green",
      onConfirm: () => restoreCategory(item.id),
      successMessage: `Categoría ${item.name} restaurada`,
    });
  };
  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Categorías</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateOpen(true)}
        >
          Nueva Categoría
        </Button>
      </Group>
      <TextInput
        placeholder="Buscar categoría..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.currentTarget.value);
          setPage(1);
        }}
        mb="md"
        maw={400}
      />
      <Paper shadow="sm" withBorder radius="md" mb="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Acciones</Table.Th>
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
            ) : !data?.data.length ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="xl">
                    No hay categorías.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.data.map((item) => {
                const isDeleted = !!item.deleted_at;
                return (
                  <Table.Tr key={item.id} opacity={isDeleted ? 0.6 : undefined}>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        #{item.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        td={isDeleted ? "line-through" : undefined}
                        fw={500}
                      >
                        {item.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {item.description || "—"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={isDeleted ? "red" : "teal"}
                        variant="dot"
                        size="sm"
                      >
                        {isDeleted ? "Eliminado" : "Activo"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="center">
                        <Button
                          size="xs"
                          variant="light"
                          color="blue"
                          onClick={() => {
                            setEditing(item);
                            setEditOpen(true);
                          }}
                        >
                          {<IconEdit></IconEdit>}
                          Editar
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color={isDeleted ? "green" : "red"}
                          onClick={() =>
                            isDeleted ? handleRestore(item) : handleDelete(item)
                          }
                        >
                          {isDeleted ? "Restaurar" : "Eliminar"}
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Paper>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total: {data?.total || 0}
        </Text>
        <Pagination total={totalPages || 1} value={page} onChange={setPage} />
      </Group>
      <CategoryCreateModal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      {editing && (
        <CategoryEditModal
          opened={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          categoryData={editing}
        />
      )}
    </>
  );
}
