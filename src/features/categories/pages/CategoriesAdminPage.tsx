import { useState, Fragment } from "react";
import {
  Table,
  Button,
  Group,
  Title,
  Paper,
  Text,
  Badge,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconRestore,
  IconTrash,
  IconChevronRight,
} from "@tabler/icons-react";
import { useAdminCategoryTree } from "../hooks/useAdminCategoryTree";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import type { CategoryNodePrivate } from "../types/category";
import { CategoryCreateModal } from "../components/CategoryCreateModal";
import { CategoryEditModal } from "../components/CategoryEditModal";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import ActionButton from "../../../shared/components/ActionButton";

export default function CategoriesAdminPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryNodePrivate | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const { data: treeData, isLoading } = useAdminCategoryTree();
  const { deleteCategory, restoreCategory } = useCategoryMutations();

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = (item: CategoryNodePrivate) => {
    showConfirm({
      title: "Eliminar categoria?",
      color: "red",
      confirmLabel: "Eliminar",
      onConfirm: () => deleteCategory(item.id),
      successMessage: `Categoría ${item.name} eliminada`,
    });
  };

  const handleRestore = (item: CategoryNodePrivate) => {
    showConfirm({
      title: "¿Restaurar categoria?",
      confirmLabel: "Restaurar",
      color: "green",
      onConfirm: () => restoreCategory(item.id),
      successMessage: `Categoría ${item.name} restaurada`,
    });
  };

  const renderTreeNode = (node: CategoryNodePrivate, depth: number) => {
    const isDeleted = !!node.deleted_at;
    const isExpanded = expanded.has(node.id);

    return (
      <Fragment key={node.id}>
        <Table.Tr opacity={isDeleted ? 0.6 : undefined}>
          <Table.Td>
            <Text size="sm" c="dimmed">
              #{node.id}
            </Text>
          </Table.Td>
          <Table.Td>
            <Group
              gap={4}
              style={{
                paddingLeft: depth * 28,
                cursor: node.has_children ? "pointer" : undefined,
              }}
              wrap="nowrap"
              onClick={() => toggleExpand(node.id)}
            >
              {node.has_children ? (
                <ActionIcon variant="light" color="cyan">
                  <IconChevronRight
                    size={14}
                    style={{
                      transform: isExpanded ? "rotate(90deg)" : undefined,
                      transition: "transform 0.15s",
                    }}
                  />
                </ActionIcon>
              ) : (
                <Box w={22} />
              )}
              <Text td={isDeleted ? "line-through" : undefined} fw={500}>
                {node.name}
              </Text>
            </Group>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {node.description || "—"}
            </Text>
          </Table.Td>
          <Table.Td>
            <Badge color={isDeleted ? "red" : "teal"} variant="dot" size="md">
              {isDeleted ? "Eliminado" : "Activo"}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Group gap="xs" justify="center">
              <ActionButton
                icon={IconEdit}
                label="Editar"
                onClick={() => {
                  setEditing(node);
                  setEditOpen(true);
                }}
                color="blue"
              />

              <ActionButton
                icon={isDeleted ? IconRestore : IconTrash}
                onClick={() =>
                  isDeleted ? handleRestore(node) : handleDelete(node)
                }
                label={isDeleted ? "Restaurar" : "Eliminar"}
                color={isDeleted ? "green" : "red"}
              />
            </Group>
          </Table.Td>
        </Table.Tr>
        {isExpanded &&
          node.children.map((child) => renderTreeNode(child, depth + 1))}
      </Fragment>
    );
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
            ) : !treeData?.length ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="xl">
                    No hay categorías.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              treeData.map((node) => renderTreeNode(node, 0))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
      <Text size="sm" c="dimmed">
        Total: {treeData?.length || 0} categorías raíz
      </Text>
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
