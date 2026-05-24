import { useState } from "react";
import { useAdminUserList } from "../hooks/admin/useAdminUserList";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Badge,
  Button,
  Group,
  Pagination,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconPlus, IconSearch } from "@tabler/icons-react";
import { AdminUserCreateModal } from "../components/AdminUserCreateModal";
import { AdminUserEditModal } from "../components/AdminUserEditModal";
import type { UserAdminRead, UserRoleRead } from "../types/user";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { useAdminUserMutations } from "../hooks/admin/useAdminUserMutations";

const roleConfig: Record<string, { label: string; color: string }> = {
  CLIENT: { label: "Cliente", color: "blue" },
  ADMIN: { label: "Admin", color: "red" },
  STOCK: { label: "Stock", color: "yellow" },
  ORDERS: { label: "Órdenes", color: "grape" },
};

const isRoleExpired = (role: UserRoleRead) =>
  !!role.expires_at && new Date(role.expires_at).getTime() < Date.now();

const UserAdminPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminModal, setAdminModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState<UserAdminRead | null>(null);
  const [debounsedSearch] = useDebouncedValue(searchTerm, 300);
  const limit = 10;
  const { data, isLoading } = useAdminUserList(
    (page - 1) * limit,
    limit,
    debounsedSearch,
  );

  const { restoreUser, deleteUser } = useAdminUserMutations();
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleRestore = (user: UserAdminRead) => {
    showConfirm({
      title: `¿Restaurar usuario ${user.name}?`,
      confirmLabel: "Restaurar",
      color: "green",
      onConfirm: () => {
        restoreUser(user.id);
      },
      successMessage: `Usuario ${user.name} restaurado!`,
    });
  };

  const handleDelete = (user: UserAdminRead) => {
    showConfirm({
      title: `¿Eliminar usuario ${user.name}?`,
      confirmLabel: "Eliminar",
      color: "red",
      onConfirm: () => {
        deleteUser(user.id);
      },
      successMessage: `Usuario ${user.name} eliminado!`,
    });
  };

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Usuarios</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setAdminModal(true);
          }}
        >
          Nuevo Usuario
        </Button>
      </Group>
      <TextInput
        placeholder="Buscar usuarios..."
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
        <Table striped highlightOnHover color="primary" verticalSpacing={"md"}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta={"center"}>ID</Table.Th>
              <Table.Th ta={"center"}>Nombre</Table.Th>
              <Table.Th ta={"center"}>Email</Table.Th>
              <Table.Th ta={"center"}>Roles</Table.Th>
              <Table.Th ta={"center"}>Estado</Table.Th>
              <Table.Th ta={"center"}>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" py="xl">
                    Cargando...
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : !data?.data.length ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" py="xl">
                    No hay usuarios.
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
                        {item.lastname}, {item.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{item.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      {item.roles.length > 0 ? (
                        <Stack justify="center" align="center" gap="xs">
                          {item.roles.map((role) => {
                            const revoked = isRoleExpired(role);
                            return (
                              <Badge
                                key={role.role_user.code}
                                color={
                                  roleConfig[role.role_user.code]?.color ??
                                  "gray"
                                }
                                variant={revoked ? "dot" : "light"}
                                size="sm"
                                style={
                                  revoked
                                    ? {
                                        textDecoration: "line-through",
                                        opacity: 0.5,
                                      }
                                    : undefined
                                }
                              >
                                {roleConfig[role.role_user.code]?.label ??
                                  role.role_user.code}
                              </Badge>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Sin roles
                        </Text>
                      )}
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
                            setEditModal(true);
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

      <AdminUserCreateModal
        opened={adminModal}
        onClose={() => setAdminModal(false)}
      />
      {editing && (
        <AdminUserEditModal
          key={editing.id}
          opened={editModal}
          onClose={() => setEditModal(false)}
          user={editing}
        />
      )}
    </>
  );
};

export default UserAdminPage;
