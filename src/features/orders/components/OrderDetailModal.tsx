import { Fragment } from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Badge,
  Table,
  Divider,
  Button,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { OrderDetailPublic, OrderStateCode } from "../types/order";
import { STATE_COLORS, STATE_LABELS } from "../types/configs";
import {
  IconClock,
  IconCircleCheckFilled,
  IconCircleCheck,
  IconChefHat,
  IconTruckDelivery,
  IconExclamationCircleFilled,
  IconX,
  IconPackages,
  IconMapPin,
  IconNotes,
  IconReportMoney,
  IconCash,
  IconCreditCard,
  IconBuildingBank,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import { useClientOrderMutations } from "../hooks/client/useClientOrderMutations";
import usePaymentMutation from "../../payment/hooks/payment.mutations.hooks";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { markManualUpdate } from "../../../shared/hooks/useOrderWebSocket";

interface Props {
  order: OrderDetailPublic | null;
  isLoading: boolean;
  opened: boolean;
  onClose: () => void;
  viewPay?: boolean;
}

const STATE_SEQUENCE: OrderStateCode[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PREP",
  "DELIVERED",
];

const STATE_ICONS: Record<string, React.ReactNode> = {
  PENDING: <IconClock size={18} />,
  CONFIRMED: <IconCircleCheck size={18} />,
  IN_PREP: <IconChefHat size={18} />,
  DELIVERED: <IconTruckDelivery size={18} />,
  CANCELLED: <IconX size={18} />,
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MERCADOPAGO: "Mercado Pago",
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia bancaria",
};

const PAYMENT_METHOD_ICONS: Record<string, React.ReactNode> = {
  MERCADOPAGO: <IconCreditCard size={20} />,
  EFECTIVO: <IconCash size={20} />,
  TRANSFERENCIA: <IconBuildingBank size={20} />,
};

const OrderDetailModal = ({
  order,
  isLoading,
  opened,
  onClose,
  viewPay = false,
}: Props) => {
  const { confirmByClient, isConfirming } = useClientOrderMutations();
  const { createCheckout, isCreating: isPaying } = usePaymentMutation();

  const handlePay = async () => {
    if (!order) return;
    try {
      const preference = await createCheckout(order.id);
      notifications.show({
        message: "Redirigiendo a Mercado Pago...",
        color: "cyan",
        radius: "lg",
        icon: <IconInfoCircleFilled />,
      });
      window.location.href = preference.init_point;
    } catch (error: unknown) {
      notifications.show({
        message: extractApiErrorMessage(error),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleConfirmCash = async () => {
    if (!order) return;
    try {
      markManualUpdate(order.id);
      await confirmByClient(order.id);
      notifications.show({
        title: "Pedido confirmado",
        message: "Pedido confirmado — pagás en efectivo al recibir",
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
    } catch (error: unknown) {
      notifications.show({
        message: extractApiErrorMessage(error),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const historialMap = new Map(
    order?.historials.map((h) => [h.state_to_code, h]) ?? [],
  );

  const timelineSteps = (() => {
    if (!order) return [];

    const steps = STATE_SEQUENCE.map((code) => ({
      code,
      historial: historialMap.get(code),
      completed: historialMap.has(code),
      isCurrent: order.state_code === code && order.state_code !== "CANCELLED",
    }));

    if (order.state_code === "CANCELLED") {
      steps.push({
        code: "CANCELLED" as OrderStateCode,
        historial: historialMap.get("CANCELLED"),
        completed: true,
        isCurrent: true,
      });
    }
    return steps;
  })();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={order ? `Orden #${order.id}` : "Detalle de orden"}
      size="xl"
      styles={{ body: { padding: 0 } }}
    >
      {isLoading ? (
        <Text ta="center" py="xl">
          Cargando detalle...
        </Text>
      ) : !order ? (
        <Text ta="center" py="xl" c="dimmed">
          No se encontró la orden.
        </Text>
      ) : (
        <Stack gap={0}>
          <Paper p="lg" withBorder={false}>
            <Group justify="space-between" wrap="wrap" gap="sm">
              <Group gap="sm">
                <Title order={3}>Orden #{order.id}</Title>
                <Badge
                  color={
                    STATE_COLORS[order.state_code as OrderStateCode] || "gray"
                  }
                  variant="light"
                  size="lg"
                >
                  {STATE_LABELS[order.state_code as OrderStateCode] ||
                    order.state_code}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {new Date(order.created_at).toLocaleString()}
              </Text>
            </Group>
          </Paper>

          <Divider />

          <Paper p="lg" withBorder={false} bg="gray.0">
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {timelineSteps.map((step, i) => {
                const color =
                  STATE_COLORS[step.code as OrderStateCode] || "gray";
                const active = step.completed || step.isCurrent;
                return (
                  <Fragment key={step.code}>
                    <Stack align="center" gap={4} style={{ flex: 1 }}>
                      <ThemeIcon
                        color={active ? color : "gray"}
                        variant={
                          step.isCurrent && step.completed
                            ? "filled"
                            : active
                              ? "light"
                              : "outline"
                        }
                        radius="xl"
                        size="lg"
                      >
                        {STATE_ICONS[step.code]}
                      </ThemeIcon>
                      <Text
                        size="xs"
                        fw={step.isCurrent ? 700 : 500}
                        c={active ? undefined : "dimmed"}
                      >
                        {STATE_LABELS[step.code as OrderStateCode] || step.code}
                      </Text>
                      {step.historial && (
                        <Text size="xs" c="dimmed">
                          {new Date(
                            step.historial.created_at,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      )}
                      {step.historial?.reason && (
                        <Text
                          size="xs"
                          c="dimmed"
                          ta="center"
                          style={{ maxWidth: 100, lineHeight: 1.2 }}
                        >
                          {step.historial.reason}
                        </Text>
                      )}
                    </Stack>
                    {i < timelineSteps.length - 1 && (
                      <div
                        style={{
                          width: 24,
                          height: 2,
                          marginTop: 18,
                          flexShrink: 0,
                          backgroundColor: active
                            ? color
                            : "var(--mantine-color-gray-3)",
                        }}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </Paper>

          <Divider />

          <Paper p="lg" withBorder={false}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Stack gap="md">
                <Paper withBorder p="md" radius="md">
                  <Group gap="sm" mb="sm">
                    <IconPackages size={20} />
                    <Title order={5}>Productos</Title>
                  </Group>
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
                      {order.order_items.map((item) => (
                        <Table.Tr key={item.product_id}>
                          <Table.Td>{item.name_snap}</Table.Td>
                          <Table.Td>{item.quantity}</Table.Td>
                          <Table.Td>
                            ${Number(item.price_snap).toFixed(2)}
                          </Table.Td>
                          <Table.Td>
                            ${Number(item.subtotal_snap).toFixed(2)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Paper>

                <Paper withBorder p="md" radius="md" bg="gray.0">
                  <Group gap="sm" mb="sm">
                    <IconReportMoney size={20} />
                    <Title order={5}>Resumen financiero</Title>
                  </Group>
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
                      <Text fw={500}>
                        ${Number(order.shipping_cost).toFixed(2)}
                      </Text>
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
                </Paper>
              </Stack>

              <Stack gap="md" justify="space-between">
                <Paper withBorder p="md" radius="md">
                  <Group gap="sm" mb="xs">
                    <IconMapPin size={20} />
                    <Title order={5}>Dirección</Title>
                  </Group>
                  {order.address ? (
                    <Text>
                      {order.address.alias} — {order.address.line_one},{" "}
                      {order.address.city}, {order.address.province}
                    </Text>
                  ) : (
                    <Text c="dimmed">Retiro en local</Text>
                  )}
                </Paper>

                <Paper withBorder p="md" radius="md">
                  <Group gap="sm" mb="xs">
                    {PAYMENT_METHOD_ICONS[order.payment_method_code] || (
                      <IconCash size={20} />
                    )}
                    <Title order={5}>Método de pago</Title>
                  </Group>
                  <Text>
                    {PAYMENT_METHOD_LABELS[order.payment_method_code] ||
                      order.payment_method_code}
                  </Text>
                </Paper>

                {order.notes && (
                  <Paper withBorder p="md" radius="md">
                    <Group gap="sm" mb="xs">
                      <IconNotes size={20} />
                      <Title order={5}>Notas</Title>
                    </Group>
                    <Text>{order.notes}</Text>
                  </Paper>
                )}

                {order.payment_method_code === "MERCADOPAGO" &&
                  viewPay &&
                  order.state_code === "PENDING" && (
                    <Button
                      size="lg"
                      color="cyan"
                      onClick={handlePay}
                      loading={isPaying}
                      fullWidth
                      leftSection={<IconCash size={20} />}
                    >
                      Pagar con MercadoPago
                    </Button>
                  )}

                {order.payment_method_code === "EFECTIVO" &&
                  viewPay &&
                  order.state_code === "PENDING" && (
                    <Button
                      size="lg"
                      onClick={handleConfirmCash}
                      loading={isConfirming}
                      fullWidth
                      leftSection={<IconCircleCheck size={20} />}
                    >
                      Confirmar pedido
                    </Button>
                  )}
              </Stack>
            </SimpleGrid>
          </Paper>
        </Stack>
      )}
    </Modal>
  );
};

export { OrderDetailModal };
