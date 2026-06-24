import { useState } from "react";
import { Title, Table, Stack } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import type {
  OrderAdmin,
  OrderFilters,
  OrderPublic,
  OrderStateCode,
} from "../types/order";
import { useAdminOrderList } from "../hooks/admin/useAdminOrderList";
import { useAdminOrderDetail } from "../hooks/admin/useAdminOrderDetail";
import { useAdminOrderMutations } from "../hooks/admin/useAdminOrderMutations";
import { OrdersTable } from "../components/OrdersTable";
import { OrderFiltersPanel } from "../components/OrdersFilterPanel";
import { UserSearchFilters } from "../components/UserSearchFilters";
import { OrderDetailModal } from "../components/OrderDetailModal";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { nextState, STATE_COLORS, stateLabel } from "../types/configs";
import ActionButton from "../../../shared/components/ActionButton";
import { IconArrowBigRightLines, IconXMark } from "@tabler/icons-react";
import { isCancellable, isProgressable } from "../helpers/helpers";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

export const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLastname, setUserLastname] = useState("");
  const limit = 10;

  const [debouncedName] = useDebouncedValue(userName, 300);
  const [debouncedEmail] = useDebouncedValue(userEmail, 300);
  const [debouncedLastname] = useDebouncedValue(userLastname, 300);

  const currentFilters = {
    ...filters,
    user_name: debouncedName || null,
    user_email: debouncedEmail || null,
    user_lastname: debouncedLastname || null,
    offset: (page - 1) * limit,
    limit,
  };
  const { data: orders, isLoading } = useAdminOrderList(currentFilters);
  const { data: detailOrder, isLoading: isDetailLoading } =
    useAdminOrderDetail(detailOrderId);
  const { cancelOrderByStaff, changeOrderState } = useAdminOrderMutations();

  const handleCancel = (order: OrderPublic) => {
    showConfirm({
      title: "¿Cancelar esta orden?",
      confirmLabel: "Confirmar",
      onConfirm: () =>
        cancelOrderByStaff({
          id: order.id,
          data: { reason: "Cancelado por administrador" },
        }),
      successMessage: "Orden cancelada exitosamente",
      color: "red",
    });
  };

  const handleAdvance = async (order: OrderPublic) => {
    const next = nextState(order.state_code as OrderStateCode);
    if (!next) return;
    try {
      await changeOrderState({ id: order.id, data: { state_code: next } });
      notifications.show({
        message: `Orden ${order.id} avanzada a ${stateLabel(next)}`,
        color: STATE_COLORS[next],
      });
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(
        error,
        "No se pudo actualizar la orden",
      );
      notifications.show({ message: msg, color: "red" });
    }
  };

  return (
    <>
      <Title order={2} mb="lg">
        Todos los Pedidos
      </Title>

      <Stack align="center">
        <UserSearchFilters
          userName={userName}
          userEmail={userEmail}
          userLastname={userLastname}
          onUserNameChange={(v) => {
            setUserName(v);
            setPage(1);
          }}
          onUserEmailChange={(v) => {
            setUserEmail(v);
            setPage(1);
          }}
          onUserLastnameChange={(v) => {
            setUserLastname(v);
            setPage(1);
          }}
        />

        <OrderFiltersPanel
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />
      </Stack>

      <OrdersTable
        orders={orders?.data}
        isLoading={isLoading}
        total={orders?.total || 0}
        page={page}
        onPageChange={setPage}
        onViewDetail={setDetailOrderId}
        extraHeaders={
          <>
            <Table.Th>Nombre</Table.Th>
          </>
        }
        renderExtraCells={(order) => {
          const ao = order as OrderAdmin;
          return (
            <>
              <Table.Td>
                {ao.user.name}, {ao.user.lastname}
              </Table.Td>
            </>
          );
        }}
        renderActions={(order) => (
          <>
            {isCancellable(order.state_code) && (
              <ActionButton
                label="Cancelar Orden"
                icon={IconXMark}
                variant="light"
                color="red"
                onClick={() => handleCancel(order)}
              ></ActionButton>
            )}

            {isProgressable(order.state_code) && (
              <ActionButton
                color="violet"
                variant="light"
                icon={IconArrowBigRightLines}
                label={`Avanzar a ${stateLabel(nextState(order.state_code as OrderStateCode)!) || "Avanzar Estado"}`}
                onClick={() => handleAdvance(order)}
              ></ActionButton>
            )}
          </>
        )}
      />

      <OrderDetailModal
        order={detailOrder || null}
        isLoading={isDetailLoading}
        opened={!!detailOrderId}
        onClose={() => setDetailOrderId(null)}
      />
    </>
  );
};
