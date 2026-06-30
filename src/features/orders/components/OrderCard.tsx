import { Card, Group, Stack, Text, Badge, Divider } from "@mantine/core";
import { IconArrowBigRightLines, IconXMark } from "@tabler/icons-react";
import type { OrderAdmin, OrderStateCode } from "../types/order";
import { STATE_COLORS, STATE_LABELS, nextState } from "../types/configs";
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

function getDelayColor(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 15) return "teal";
  if (mins < 30) return "yellow";
  return "red";
}

export function OrderCard({
  order,
  onAdvance,
  onCancel,
  borderColor,
}: OrderCardProps) {
  const code = order.state_code as OrderStateCode;
  const next = nextState(code);

  return (
    <Card
      withBorder
      shadow="sm"
      padding="md"
      radius="lg"
      bg={`${STATE_COLORS[code]}.5`}
      bd={borderColor ? `2px solid ${borderColor}` : undefined}
    >
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Text c="white" fw={800}>
              #{order.id}{" "}
            </Text>
            <Badge color={STATE_COLORS[code] || "gray"} variant="light">
              {STATE_LABELS[code] || code}
            </Badge>
          </Group>
          <Badge
            variant="light"
            color={getDelayColor(order.created_at)}
            size="sm"
            style={{ whiteSpace: "nowrap" }}
          >
            {relativeTime(order.created_at)}
          </Badge>
        </Group>

        <Group>
          <Text size="sm" c="white" fw={600}>
            Cliente:
          </Text>
          <Text size="sm" c="white" lineClamp={1}>
            {order.user.name} {order.user.lastname}
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
              variant="light"
              color="orange"
              text="Cancelar"
              icon={IconXMark}
              onClick={() => onCancel(order)}
              label="Cancelar Orden"
            />
          )}
        </Group>

        <Divider my="xs" />

        {order.order_items.length === 0 ? (
          <Text c="white" size="sm" ta="center" py="xs">
            Sin productos
          </Text>
        ) : (
          <Group gap="sm" justify="center">
            {order.order_items.map((item) => (
              <Badge
                key={item.product_id}
                variant="light"
                size="lg"
                color="gray"
              >
                {item.name_snap} x{item.quantity}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );
}

export default OrderCard;
