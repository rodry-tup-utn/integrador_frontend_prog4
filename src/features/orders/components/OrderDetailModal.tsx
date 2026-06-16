import {
  Modal,
  Stack,
  Group,
  Text,
  Badge,
  Table,
  Divider,
  Button,
} from "@mantine/core";
import type { OrderDetailPublic, OrderStateCode } from "../types/order";
import { STATE_COLORS, STATE_LABELS } from "../types/configs";
import { IconZoomMoney } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface Props {
  order: OrderDetailPublic | null;
  isLoading: boolean;
  opened: boolean;
  onClose: () => void;
}

export const OrderDetailModal = ({
  order,
  isLoading,
  opened,
  onClose,
}: Props) => {
  const navigate = useNavigate();
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={order ? `Orden #${order.id}` : "Detalle de orden"}
      size="lg"
      centered
    >
      {isLoading ? (
        <Text ta="center" py="md">
          Cargando detalle...
        </Text>
      ) : !order ? (
        <Text ta="center" py="md" c="dimmed">
          No se encontró la orden.
        </Text>
      ) : (
        <Stack gap="md">
          <Group justify="space-between">
            <Badge
              color={STATE_COLORS[order.state_code as OrderStateCode] || "gray"}
              variant="light"
              size="lg"
            >
              {STATE_LABELS[order.state_code as OrderStateCode] ||
                order.state_code}
            </Badge>
            <Text fw="bold">
              {order.user.lastname}, {order.user.name}
            </Text>
            <Text size="sm" c="dimmed">
              {new Date(order.created_at).toLocaleString()}
            </Text>
          </Group>

          <Divider />

          <Group grow>
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                Subtotal
              </Text>
              <Text fw={500}>${Number(order.subtotal).toFixed(2)}</Text>
            </Stack>
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                Descuento
              </Text>
              <Text fw={500}>${Number(order.discount).toFixed(2)}</Text>
            </Stack>
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                Envío
              </Text>
              <Text fw={500}>${Number(order.shipping_cost).toFixed(2)}</Text>
            </Stack>
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                Total
              </Text>
              <Text fw={700}>
                $
                {(
                  Number(order.subtotal) -
                  Number(order.discount) +
                  Number(order.shipping_cost)
                ).toFixed(2)}
              </Text>
            </Stack>
          </Group>

          <Divider label="Dirección de envío" />
          <Text>
            {order.address.alias} — {order.address.line_one},{" "}
            {order.address.city}, {order.address.province}
          </Text>

          <Divider label="Productos" />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Producto</Table.Th>
                <Table.Th>Cant.</Table.Th>
                <Table.Th>Precio</Table.Th>
                <Table.Th>Subtotal</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {order.items.map((item) => (
                <Table.Tr key={item.product_id}>
                  <Table.Td>{item.name_snap}</Table.Td>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>${Number(item.price_snap).toFixed(2)}</Table.Td>
                  <Table.Td>${Number(item.subtotal_snap).toFixed(2)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {order.notes && (
            <>
              <Divider label="Notas" />
              <Text size="sm">{order.notes}</Text>
            </>
          )}

          {order.historials?.length > 0 && (
            <>
              <Divider label="Historial de estados" />
              <Stack gap="xs">
                {order.historials.map((h, i) => (
                  <Group key={i} gap="sm">
                    <Badge
                      color={
                        STATE_COLORS[h.state_to_code as OrderStateCode] ||
                        "gray"
                      }
                      variant="dot"
                      size="sm"
                    >
                      {STATE_LABELS[h.state_to_code as OrderStateCode] ||
                        h.state_to_code}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {new Date(h.created_at).toLocaleString()}
                    </Text>
                    {h.reason && (
                      <Text size="xs" c="dimmed">
                        — {h.reason}
                      </Text>
                    )}
                  </Group>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      )}
      <Group mt="md" justify="center">
        <Button
          color="blue"
          variant="outline"
          onClick={() => navigate(`/checkout/payment/${order?.id}`)}
        >
          <IconZoomMoney />
          Consultar Pago
        </Button>
      </Group>
    </Modal>
  );
};
