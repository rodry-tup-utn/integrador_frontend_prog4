import { useState } from "react";
import { Title, Button, Stack } from "@mantine/core";
import type { OrderClientFilters, OrderPublic } from "../types/order";
import { useClientOrderList } from "../hooks/client/useClientOrderList";
import { useClientOrderDetail } from "../hooks/client/useClientOrderDetail";
import { useClientOrderMutations } from "../hooks/client/useClientOrderMutations";
import { OrdersTable } from "../components/OrdersTable";
import { OrderFiltersPanel } from "../components/OrdersFilterPanel";
import { OrderDetailModal } from "../components/OrderDetailModal";
import { showConfirm } from "../../../shared/components/ShowConfirm";

export const MyOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderClientFilters>({});
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null);
  const limit = 10;

  const currentFilters = { ...filters, offset: (page - 1) * limit, limit };
  const { data: orders, isLoading } = useClientOrderList(currentFilters);
  const { data: detailOrder, isLoading: isDetailLoading } =
    useClientOrderDetail(detailOrderId);
  const { cancelOrder } = useClientOrderMutations();

  const handleCancel = (order: OrderPublic) => {
    showConfirm({
      title: "Desea cancelar su orden",
      confirmLabel: "Confirmar",
      onConfirm: () => cancelOrder(order.id),
      successMessage: "Su orden ha sido cancelada exitosamente",
      color: "orange",
    });
  };

  return (
    <>
      <Title order={2} mb="lg">
        Mis Pedidos
      </Title>

      <Stack align="center">
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
        renderActions={(order) =>
          order.state_code === "PENDING" ? (
            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={() => handleCancel(order)}
            >
              Cancelar
            </Button>
          ) : null
        }
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
