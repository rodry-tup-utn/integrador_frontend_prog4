import { useState } from "react";
import { useAdminUserList } from "../hooks/admin/useAdminUserList";
import type { UserDetailRead } from "../types/user";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Badge,
  Button,
  Group,
  Pagination,
  Paper,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconPlus, IconSearch } from "@tabler/icons-react";

const UserAdminPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<UserDetailRead | null>(null);
  const [debounsedSearch] = useDebouncedValue(searchTerm, 300);
  const [modal, setModalOpen] = useState(false);
  const limit = 10;
  const { data, isLoading } = useAdminUserList(
    (page - 1) * limit,
    limit,
    debounsedSearch,
  );
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleRestore = (id: number) => {
    console.log("Restaurando...");
  };

  const handleDelete = (id: number) => {
    console.log("Borrando...");
  };

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Usuarios</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
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
        <Table striped highlightOnHover color="primary">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Email</Table.Th>
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
                    <Text fw={500}>{item.email}</Text>

                    <Table.Td></Table.Td>

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
    </>
  );
};

export default UserAdminPage;
