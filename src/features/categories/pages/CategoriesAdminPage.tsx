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
  Modal,
  ModalContent,
} from "@mantine/core";
import { IconSearch, IconPlus, IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAdminCategoryList } from "../hooks/useAdminCategoryList";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import type { CategoryPrivate } from "../types/category";
import { useDebouncedValue } from "@mantine/hooks";
import { CategoryModal } from "../components/CategoryModal";
import { useDisclosure } from "@mantine/hooks";
export default function CategoriesAdminPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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
  const [opened, { open, close }] = useDisclosure(false);
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      notifications.show({ color: "green", message: "Categoría eliminada" });
    } catch (e: any) {
      notifications.show({
        color: "red",
        message: e.response?.data?.detail || "Error",
      });
    }
  };

  const onRestoreClick = async (id: number) => {
    try {
      await restoreCategory(id);
      notifications.show({
        title: "Exito",
        message: "Categoria Restaurada",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        color: "red",
        message: error.response?.data?.detail || "Error",
      });
    }
  };

  const handleRestore = async (id: number) => {
    try {
      notifications.show({
        color: "cyan",
        message: (
          <Group justify="space-between" wrap="nowrap">
            <Text size="md">¿Restaurar Categoria?</Text>
            <Button onClick={() => onRestoreClick(id)}>
              Restaurar Categoria
            </Button>
          </Group>
        ),
      });
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
        <Title order={2}>Categorías</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
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
                            setModalOpen(true);
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
                            isDeleted
                              ? handleRestore(item.id)
                              : handleDelete(item.id)
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
      <Button onClick={open}>Abrir Modal</Button>

      <CategoryModal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        categoryData={editing}
      />
    </>
  );
}
