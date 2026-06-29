import { useEffect, useRef } from "react";
import { notifications } from "@mantine/notifications";
import {
  IconExclamationCircleFilled,
  IconCircleCheckFilled,
  IconAlertTriangleFilled,
  IconInfoCircleFilled,
  IconArrowRight,
} from "@tabler/icons-react";
import { queryClient } from "../api/queryClient";
import { orderKeys } from "../../features/orders/types/order";

let activeWs: WebSocket | null = null;
const subscribedOrders = new Set<number>();
const recentlyManuallyUpdated = new Set<number>();

export function markManualUpdate(orderId: number) {
  recentlyManuallyUpdated.add(orderId);
  setTimeout(() => recentlyManuallyUpdated.delete(orderId), 3000);
}

const WS_URL =
  (import.meta.env.VITE_API_URL as string).replace(/^http/, "ws") + "/ws";

interface WsOrderEvent {
  event: "order_created" | "order_updated" | "payment_approved";
  data: {
    order_id: number;
    state?: string;
  };
}

const STATE_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  IN_PREP: "En preparación",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATE_COLORS: Record<string, string> = {
  PENDING: "yellow",
  CONFIRMED: "blue",
  IN_PREP: "orange",
  DELIVERED: "green",
  CANCELLED: "red",
};

function getOrderIcon(state?: string) {
  switch (state) {
    case "DELIVERED":
      return <IconCircleCheckFilled />;
    case "CANCELLED":
      return <IconExclamationCircleFilled />;
    case "PENDING":
      return <IconAlertTriangleFilled />;
    case "IN_PREP":
      return <IconArrowRight />;
    default:
      return <IconInfoCircleFilled />;
  }
}

const EVENT_CONFIG: Record<
  string,
  { title: (id: number) => string; message: (state: string) => string }
> = {
  order_created: {
    title: (id) => `Nuevo pedido #${id}`,
    message: () => "Pendiente de pago",
  },
  order_updated: {
    title: (id) => `Pedido #${id} actualizado`,
    message: (state) => `Estado: ${STATE_LABELS[state] || state}`,
  },
  payment_approved: {
    title: (id) => `Pago aprobado para pedido #${id}`,
    message: () => "El pago fue confirmado",
  },
};

export function useOrderWebSocket(enabled: boolean) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const attemptRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      activeWs = ws;

      ws.onopen = () => {
        attemptRef.current = 0;
        if (subscribedOrders.size > 0) {
          subscribedOrders.forEach((oid) => {
            ws.send(
              JSON.stringify({ action: "subscribe-order", order_id: oid }),
            );
          });
        }
      };

      ws.onmessage = (raw) => {
        try {
          const msg: WsOrderEvent = JSON.parse(raw.data);

          if (
            msg.event === "order_created" ||
            msg.event === "order_updated" ||
            msg.event === "payment_approved"
          ) {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });

            if (recentlyManuallyUpdated.has(msg.data.order_id)) {
              return;
            }

            const config = EVENT_CONFIG[msg.event];
            const color = msg.data.state
              ? STATE_COLORS[msg.data.state] || "blue"
              : "teal";

            notifications.show({
              title: config.title(msg.data.order_id),
              message: config.message(msg.data.state ?? ""),
              color,
              radius: "lg",
              icon: getOrderIcon(msg.data.state),
            });
          }
        } catch {
          // ignorar mensajes malformados
        }
      };

      ws.onclose = () => {
        activeWs = null;
        if (!wsRef.current) return;
        const delay = Math.min(3000 * Math.pow(2, attemptRef.current), 30000);
        attemptRef.current++;
        reconnectRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      activeWs = null;
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [enabled]);
}

export function subscribeToOrder(orderId: number) {
  if (subscribedOrders.has(orderId)) return;
  subscribedOrders.add(orderId);
  if (activeWs && activeWs.readyState === WebSocket.OPEN) {
    activeWs.send(
      JSON.stringify({ action: "subscribe-order", order_id: orderId }),
    );
  }
}

export function unsubscribeFromOrder(orderId: number) {
  subscribedOrders.delete(orderId);
  if (activeWs && activeWs.readyState === WebSocket.OPEN) {
    activeWs.send(
      JSON.stringify({ action: "unsubscribe-order", order_id: orderId }),
    );
  }
}
