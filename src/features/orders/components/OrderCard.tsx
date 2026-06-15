import { useState } from "react";
import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Collapse,
  Divider,
  Table,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconArrowBigRightLines,
  IconXMark,
} from "@tabler/icons-react";
import type { OrderAdmin, OrderStateCode } from "../types/order";
import { STATE_COLORS, STATE_LABELS, nextState } from "../types/configs";
import { useAdminOrderDetail } from "../hooks/admin/useAdminOrderDetail";
import ActionButton from "../../../shared/components/ActionButton";
import { isCancellable } from "../helpers/helpers";

interface OrderCardProps {
  order: OrderAdmin;
  onAdvance: (order: OrderAdmin) => void;
  onCancel: (order: OrderAdmin) => void;
  borderColor?: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export function OrderCard({
  order,
  onAdvance,
  onCancel,
  borderColor = "green",
}: OrderCardProps) {
  const [opened, setOpened] = useState(false);
  const { data: detail, isLoading } = useAdminOrderDetail(
    opened ? order.id : null,
  );
  const code = order.state_code as OrderStateCode;
  const next = nextState(code);

  return (
    <Card
      style={{
        borderColor,
        borderWidth: "2px",
      }}
      padding="md"
      radius="md"
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Text fw={700}>#{order.id}</Text>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {order.user.name} {order.user.lastname}
            </Text>
          </Group>
          <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
            {relativeTime(order.created_at)}
          </Text>
        </Group>

        <Group justify="space-between">
          <Badge color={STATE_COLORS[code] || "gray"} variant="light" size="sm">
            {STATE_LABELS[code] || code}
          </Badge>
          <Text size="sm" c="dimmed">
            ${Number(order.subtotal).toFixed(2)}
          </Text>
        </Group>

        <Group gap="xs">
          {next && (
            <ActionButton
              label={`Cambiar a ${STATE_LABELS[next]}`}
              color={STATE_COLORS[next]}
              onClick={() => onAdvance(order)}
              variant="light"
              text="Avanzar"
              icon={IconArrowBigRightLines}
            />
          )}
          {isCancellable(order.state_code) && (
            <ActionButton
              variant="subtle"
              color="orange"
              text="Cancelar"
              icon={IconXMark}
              onClick={() => onCancel(order)}
              label="Cancelar Orden"
            />
          )}
          <ActionButton
            variant="subtle"
            color="gray"
            text="Mostrar Detalles"
            icon={opened ? IconChevronUp : IconChevronDown}
            onClick={() => setOpened((v) => !v)}
            label={opened ? "Mostrar detalles" : "Ocultar Detalles"}
          />
        </Group>

        <Collapse expanded={opened}>
          <Divider my="sm" />

          {isLoading ? (
            <Center py="md">
              <Loader size="md" />
            </Center>
          ) : !detail || detail.items.length === 0 ? (
            <Text c="dimmed" size="md" ta="center" py="md">
              Sin productos
            </Text>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Producto</Table.Th>
                  <Table.Th>Cant.</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {detail.items.map((item) => (
                  <Table.Tr key={item.product_id}>
                    <Table.Td>{item.name_snap}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Collapse>
      </Stack>
    </Card>
  );
}

export default OrderCard;
