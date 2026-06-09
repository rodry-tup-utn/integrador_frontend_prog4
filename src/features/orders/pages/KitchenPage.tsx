import { Title, Group, Stack, Badge } from "@mantine/core";
import type { OrderAdmin, OrderStateCode } from "../types/order";
import { useKitchenOrders } from "../hooks/useKitchenOrders";
import { useAdminOrderMutations } from "../hooks/admin/useAdminOrderMutations";
import { KitchenColumn } from "../components/KitchenColumn";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { nextState, stateLabel } from "../types/configs";
import { STATE_COLORS } from "../types/configs";
import { useState } from "react";
import ActionButton from "../../../shared/components/ActionButton";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";

export function KitchenPage() {
  const columns = useKitchenOrders();
  const [showDelivered, setShowDelivered] = useState(true);

  const { changeOrderState, cancelOrderByStaff } = useAdminOrderMutations();

  const handleAdvance = (order: OrderAdmin) => {
    const code = order.state_code as OrderStateCode;
    const next = nextState(code);
    if (!next) return;

    showConfirm({
      title: `Avanzar orden #${order.id} a "${stateLabel(next)}"?`,
      confirmLabel: "Avanzar",
      onConfirm: () =>
        changeOrderState({ id: order.id, data: { state_code: next } }),
      successMessage: `Orden #${order.id} avanzada a ${stateLabel(next)}`,
      color: STATE_COLORS[next],
    });
  };

  const handleCancel = (order: OrderAdmin) => {
    const data = { reason: "Cancelado por Cocina" };
    showConfirm({
      title: `Cancelar orden #${order.id}?`,
      confirmLabel: "Cancelar",
      onConfirm: () => cancelOrderByStaff({ id: order.id, data: data }),
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
        <Stack>
          <Badge variant="outline" color="lime">
            Finalizados
          </Badge>
          <ActionButton
            label={showDelivered ? "Ocultar" : "Mostrar"}
            onClick={() => setShowDelivered(!showDelivered)}
            color="lime"
            icon={showDelivered ? IconEye : IconEyeClosed}
          />
        </Stack>
      </Group>
      <Group grow align="flex-start" gap="md">
        {columns
          .filter((col) => showDelivered || col.state !== "DELIVERED")
          .map((col) => (
            <KitchenColumn
              key={col.state}
              state={col.state as OrderStateCode}
              orders={col.orders}
              isLoading={col.isLoading}
              onAdvance={handleAdvance}
              onCancel={handleCancel}
            />
          ))}
      </Group>
    </>
  );
}
