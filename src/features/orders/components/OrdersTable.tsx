import { Table, Paper, Group, Pagination, Text, Badge } from "@mantine/core";
import type { OrderPublic, OrderStateCode } from "../types/order";
import { STATE_COLORS, STATE_LABELS } from "../types/configs";
import ActionButton from "../../../shared/components/ActionButton";
import { IconEye } from "@tabler/icons-react";

interface Props {
  orders: OrderPublic[] | undefined;
  isLoading: boolean;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onViewDetail: (id: number) => void;
  renderActions: (order: OrderPublic) => React.ReactNode;
  extraHeaders?: React.ReactNode;
  renderExtraCells?: (order: OrderPublic) => React.ReactNode;
}

export const OrdersTable = ({
  orders,
  isLoading,
  total,
  page,
  onPageChange,
  onViewDetail,
  renderActions,
  extraHeaders,
  renderExtraCells,
}: Props) => {
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <>
      <Paper shadow="sm" withBorder radius="md" mb="md">
        <Table.ScrollContainer minWidth={500}>
          <Table striped highlightOnHover horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                {extraHeaders}
                <Table.Th>Fecha</Table.Th>
                <Table.Th ta="center" style={{ whiteSpace: "nowrap" }}>
                  Estado
                </Table.Th>

                <Table.Th>Total</Table.Th>
                <Table.Th ta="center" p="lg">
                  Acciones
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={extraHeaders ? 6 : 5}>
                    <Text ta="center" py="md">
                      Cargando órdenes...
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : !orders?.length ? (
                <Table.Tr>
                  <Table.Td colSpan={extraHeaders ? 6 : 5}>
                    <Text ta="center" py="md" c="dimmed">
                      No se encontraron pedidos.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                orders.map((order) => {
                  const subtotal = Number(order.subtotal);
                  const discount = Number(order.discount);
                  const shipping = Number(order.shipping_cost);
                  const totalAmount = subtotal - discount + shipping;
                  return (
                    <Table.Tr key={order.id}>
                      <Table.Td>#{order.id}</Table.Td>
                      {renderExtraCells?.(order)}
                      <Table.Td>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text
                          component="span"
                          c={
                            STATE_COLORS[order.state_code as OrderStateCode] ||
                            "gray"
                          }
                          fw={600}
                          size="sm"
                          tt="uppercase"
                          bg={`${STATE_COLORS[order.state_code as OrderStateCode] || "gray"}.1`}
                          px={8}
                          py={2}
                          style={{ borderRadius: "var(--mantine-radius-sm)" }}
                        >
                          {STATE_LABELS[order.state_code as OrderStateCode] ||
                            order.state_code}
                        </Text>
                      </Table.Td>

                      <Table.Td>
                        <Text fw={700}>${totalAmount.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="md" justify="center">
                          <ActionButton
                            icon={IconEye}
                            label="Ver detalle"
                            color="teal"
                            variant="light"
                            onClick={() => onViewDetail(order.id)}
                          ></ActionButton>
                          {renderActions(order)}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total: {total || 0}
        </Text>
        <Pagination total={totalPages} value={page} onChange={onPageChange} />
      </Group>
    </>
  );
};
