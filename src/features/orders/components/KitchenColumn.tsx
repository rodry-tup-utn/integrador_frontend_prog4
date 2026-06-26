import {
  Stack,
  Title,
  Text,
  ScrollArea,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import type { OrderAdmin, OrderStateCode } from "../types/order";
import { STATE_COLORS, STATE_LABELS } from "../types/configs";
import { OrderCard } from "./OrderCard";

interface KitchenColumnProps {
  state: OrderStateCode;
  orders: OrderAdmin[];
  isLoading: boolean;
  onAdvance: (order: OrderAdmin) => void;
  onCancel: (order: OrderAdmin) => void;
}

export function KitchenColumn({
  state,
  orders,
  isLoading,
  onAdvance,
  onCancel,
}: KitchenColumnProps) {
  const color = STATE_COLORS[state] || "gray";
  const label = STATE_LABELS[state] || state;

  return (
    <Paper shadow="md" withBorder>
      <Stack p="md" gap="sm">
        <Title order={4} c={color}>
          {label}
          <Text component="span" size="sm" c="dimmed">
            ({orders.length})
          </Text>
        </Title>

        {isLoading ? (
          <Text c="dimmed" size="sm" ta="center" py="xl">
            Cargando...
          </Text>
        ) : orders.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" py="xl">
            Sin pedidos
          </Text>
        ) : (
          <ScrollArea h="calc(100vh - 280px)" offsetScrollbars>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAdvance={onAdvance}
                  onCancel={onCancel}
                  borderColor={STATE_COLORS[order.state_code as OrderStateCode]}
                />
              ))}
            </SimpleGrid>
          </ScrollArea>
        )}
      </Stack>
    </Paper>
  );
}
