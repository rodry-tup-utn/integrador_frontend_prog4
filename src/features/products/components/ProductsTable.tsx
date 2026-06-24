import { Badge, Button, Group, Table, Text, Tooltip } from "@mantine/core";
import type {
  ProductPrivate,
  ProductPrivateList,
  TypeProduct,
} from "../types/product";
import {
  IconEdit,
  IconInfoCircle,
  IconRestore,
  IconTrash,
  IconEyeSearch,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import ActionButton from "../../../shared/components/ActionButton";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";

interface ProductsTableProps {
  isLoading?: boolean;
  data?: ProductPrivateList;
  onRestore: (item: ProductPrivate) => void;
  onDelete: (item: ProductPrivate) => void;
  onModalOpen: (value: boolean) => void;
  onEdit: (id: number) => void;
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
}: ProductsTableProps) => {
  const { user } = useAuth();
  const { data: measurementUnits } = useMeasurementUnits();
  const unitSymbolMap = new Map(
    (measurementUnits ?? []).map((u) => [u.code, u.name]),
  );

  const resolveSymbol = (code: string) => unitSymbolMap.get(code) ?? code;

  const isAdmin = user?.roles.some((r) => r == "ADMIN");
  const navigate = useNavigate();
  const { changeStockAvailable } = useProductMutation();

  const handleAvailability = async (
    product: ProductPrivate,
    availability: boolean,
  ) => {
    try {
      const state = product.available
        ? { label: "No disponible", color: "orange" }
        : { label: "Disponible", color: "blue" };
      await changeStockAvailable({
        id: product.id,
        is_available: availability,
      });
      notifications.show({
        message: `Producto ${product.name} cambiado a ${state.label}`,
        color: state.color,
      });
    } catch (error) {
      const message = extractApiErrorMessage(
        error,
        "No se pudo cambiar la disponibilidad",
      );
      notifications.show({
        message: message,
        color: "red",
      });
    }
  };

  return (
    <Table striped="odd" stripedColor="#fff" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Nombre</Table.Th>
          <Table.Th>Precio</Table.Th>
          <Table.Th>Estado</Table.Th>
          <Table.Th ta="center">Tipo</Table.Th>
          <Table.Th>
            <Group gap={4}>
              Stock
              <Tooltip label="Stock de manufacturados calculados en base al stock de ingredientes disponible">
                <IconInfoCircle size={16} style={{ cursor: "pointer" }} />
              </Tooltip>
            </Group>
          </Table.Th>
          <Table.Th ta="center">Unidad</Table.Th>
          <Table.Th ta="center">Disponibilidad</Table.Th>
          <Table.Th style={{ textAlign: "center" }}>Acciones</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {isLoading ? (
          <Table.Tr>
            <Table.Td colSpan={8}>
              <Text ta="center" py="xl">
                Cargando...
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : !data?.data.length ? (
          <Table.Tr>
            <Table.Td colSpan={9}>
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
                    {item.type === "MANUFACTURED"
                      ? `~${item.stock ?? "—"}`
                      : (item.stock ?? "—")}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Badge size="sm" color="blue" variant="outline">
                    {resolveSymbol(item.sales_unit || "UNIT")}
                  </Badge>
                </Table.Td>
                <Table.Td ta="center">
                  <Tooltip
                    label={
                      item.available
                        ? "Marcar No disponible"
                        : "Marcar Disponible"
                    }
                    color={item.available ? "orange" : "teal"}
                  >
                    <Button
                      size="compact-xs"
                      variant="outline"
                      color={item.available ? "green" : "red"}
                      onClick={() => handleAvailability(item, !item.available)}
                    >
                      {item.available ? "Disponible " : "No disponible"}
                    </Button>
                  </Tooltip>
                </Table.Td>

                <Table.Td>
                  <Group gap={4} justify="center">
                    <ActionButton
                      icon={IconEdit}
                      label="Editar"
                      color="cyan"
                      onClick={() => onEdit(item.id)}
                    />
                    <ActionButton
                      icon={IconEyeSearch}
                      label="Detalles"
                      color="teal"
                      onClick={() =>
                        navigate(`/admin/products/detail/${item.id}`)
                      }
                    />
                    {isAdmin && (
                      <ActionButton
                        icon={isDeleted ? IconRestore : IconTrash}
                        onClick={() =>
                          isDeleted ? onRestore(item) : onDelete(item)
                        }
                        label={isDeleted ? "Restaurar" : "Eliminar"}
                        color={isDeleted ? "green" : "red"}
                      />
                    )}
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
