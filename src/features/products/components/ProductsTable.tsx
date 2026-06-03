import { Badge, Button, Group, Table, Text } from "@mantine/core";
import type {
  ProductPrivate,
  ProductPrivateList,
  TypeProduct,
} from "../types/product";
import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

interface ProductsTableProps {
  isLoading?: boolean;
  data?: ProductPrivateList;
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (item: ProductPrivate) => void;
  onModalOpen: (value: boolean) => void;
}

const mapType = (type: TypeProduct) => {
  if (type == "FINAL") {
    return "Final";
  }
  return "Manufacturado";
};

const ProductsTable = ({
  isLoading,
  data,
  onRestore,
  onDelete,
  onEdit,
  onModalOpen,
}: ProductsTableProps) => {
  const { user } = useAuth();

  const isAdmin = user?.roles.some((r) => r == "ADMIN");
  const navigate = useNavigate();

  return (
    <Table striped="odd" stripedColor="#fff" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Nombre</Table.Th>
          <Table.Th>Precio</Table.Th>
          <Table.Th>Estado</Table.Th>
          <Table.Th ta="center">Tipo</Table.Th>
          <Table.Th>Stock</Table.Th>
          <Table.Th ta="center">Disponibilidad</Table.Th>
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
                No hay productos.
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          data.data.map((item) => {
            const isDeleted = !!item?.deleted_at;
            return (
              <Table.Tr key={item.id} opacity={isDeleted ? 0.6 : undefined}>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    #{item.id}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text td={isDeleted ? "line-through" : undefined} fw={500}>
                    {item.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dark" lineClamp={1}>
                    {`$ ${item.base_price}`}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={isDeleted ? "red" : "teal"}
                    variant="filled"
                    size="sm"
                  >
                    {isDeleted ? "Inactivo" : "Activo"}
                  </Badge>
                </Table.Td>
                <Table.Td ta="center">
                  <Badge
                    color={item.type == "FINAL" ? "orange" : "lime"}
                    variant="light"
                    size="md"
                  >
                    {mapType(item.type)}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Text
                    size="sm"
                    c={item.stock > 0 ? "teal" : "red"}
                    lineClamp={1}
                  >
                    {item.stock || "—"}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Button
                    size="compact-xs"
                    variant="outline"
                    color={item.available ? "green" : "red"}
                    onClick={() =>
                      navigate(`/admin/products/detail/${item.id}`)
                    }
                  >
                    {item.available ? "Disponible " : "No disponible"}
                  </Button>
                </Table.Td>

                <Table.Td>
                  <Group gap="xs" justify="center">
                    <Button
                      size="xs"
                      variant="light"
                      color="blue"
                      onClick={() => {
                        onEdit(item);
                        onModalOpen(true);
                      }}
                    >
                      {<IconEdit></IconEdit>}
                      Editar
                    </Button>
                    {isAdmin && (
                      <Button
                        size="xs"
                        variant="light"
                        color={isDeleted ? "green" : "red"}
                        onClick={() =>
                          isDeleted ? onRestore(item.id) : onDelete(item.id)
                        }
                      >
                        {isDeleted ? "Restaurar" : "Eliminar"}
                      </Button>
                    )}
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() =>
                        navigate(`/admin/products/detail/${item.id}`)
                      }
                    >
                      Ver detalle
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  );
};

export default ProductsTable;
