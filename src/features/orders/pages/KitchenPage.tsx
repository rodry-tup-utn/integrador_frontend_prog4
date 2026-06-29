import { Title, Group, SimpleGrid } from "@mantine/core";
import type { OrderAdmin, OrderStateCode } from "../types/order";
import { useKitchenOrders } from "../hooks/useKitchenOrders";
import { useAdminOrderMutations } from "../hooks/admin/useAdminOrderMutations";
import { KitchenColumn } from "../components/KitchenColumn";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { nextState, stateLabel } from "../types/configs";
import { STATE_COLORS } from "../types/configs";

import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { markManualUpdate } from "../../../shared/hooks/useOrderWebSocket";
import { notifications } from "@mantine/notifications";
import {
  IconExclamationCircleFilled,
  IconArrowRight,
} from "@tabler/icons-react";

export function KitchenPage() {
  const columns = useKitchenOrders();

  const { changeOrderState, cancelOrderByStaff } = useAdminOrderMutations();

  const handleAdvance = async (order: OrderAdmin) => {
    const code = order.state_code as OrderStateCode;
    const next = nextState(code);
    if (!next) return;

    markManualUpdate(order.id);
    try {
      await changeOrderState({ id: order.id, data: { state_code: next } });
      notifications.show({
        message: `Orden avanzada a ${stateLabel(next)}`,
        color: STATE_COLORS[next],
        radius: "lg",
        icon: <IconArrowRight />,
      });
    } catch (error: unknown) {
      const mgs = extractApiErrorMessage(error, "Error al avanzar la orden");
      notifications.show({
        message: mgs,
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleCancel = (order: OrderAdmin) => {
    const data = { reason: "Cancelado por Cocina" };
    showConfirm({
      title: `Cancelar orden #${order.id}?`,
      confirmLabel: "Cancelar",
      onConfirm: () => {
        markManualUpdate(order.id);
        return cancelOrderByStaff({ id: order.id, data: data });
      },
      successMessage: `Orden #${order.id} cancelada`,
      color: "red",
    });
  };

  return (
    <>
      <Group justify="space-between">
        <Title order={2} mb="lg">
          Cocina
        </Title>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {columns.map((col) => (
          <KitchenColumn
            key={col.state}
            state={col.state as OrderStateCode}
            orders={col.orders}
            isLoading={col.isLoading}
            onAdvance={handleAdvance}
            onCancel={handleCancel}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
