import { useState } from "react";
import { useAdminUserList } from "../hooks/admin/useAdminUserList";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Group,
  Pagination,
  Paper,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { AdminUserCreateModal } from "../components/admin/AdminUserCreateModal";
import { AdminUserEditModal } from "../components/admin/AdminUserEditModal";
import type { UserAdminRead } from "../types/user";
import ActionButton from "../../../shared/components/ActionButton";
import { useAuth } from "../../auth/context/AuthContext";
import UserAdminRow from "../components/admin/UserAdminRow";

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

  const { user } = useAuth();

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Usuarios</Title>
        <ActionButton
          text="Nuevo Usuario"
          icon={IconPlus}
          onClick={() => {
            setAdminModal(true);
          }}
          label="Agregar Usuario"
          color="green"
          variant="filled"
        />
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
        <Table.ScrollContainer minWidth={600}>
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
              data.data
                .filter((u) => u.id !== user?.id)
                .map((item) => (
                  <UserAdminRow
                    key={item.id}
                    user={item}
                    handleEdit={() => {
                      setEditing(item);
                      setEditModal(true);
                    }}
                  />
                ))
            )}
          </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
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
