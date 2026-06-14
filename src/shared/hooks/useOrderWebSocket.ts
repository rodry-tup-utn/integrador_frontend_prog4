import { useEffect, useRef } from "react";
import { notifications } from "@mantine/notifications";
import { queryClient } from "../api/queryClient";
import { orderKeys } from "../../features/orders/types/order";

const WS_URL =
  (import.meta.env.VITE_API_URL as string).replace(/^http/, "ws") + "/ws";

interface WsOrderEvent {
  event: "order_created" | "order_updated";
  data: {
    order_id: number;
    state: string;
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

const EVENT_CONFIG: Record<
  string,
  { title: (id: number) => string; message: (state: string) => string }
> = {
  order_created: {
    title: (id) => `Nuevo pedido #${id}`,
    message: (state) => STATE_LABELS[state] || state,
  },
  order_updated: {
    title: (id) => `Pedido #${id} actualizado`,
    message: (state) => STATE_LABELS[state] || state,
  },
};

export function useOrderWebSocket(enabled: boolean) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const attemptRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        attemptRef.current = 0;
      };

      ws.onmessage = (raw) => {
        try {
          const msg: WsOrderEvent = JSON.parse(raw.data);

          if (
            msg.event === "order_created" ||
            msg.event === "order_updated"
          ) {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });

            const config = EVENT_CONFIG[msg.event];
            const color = STATE_COLORS[msg.data.state] || "blue";

            notifications.show({
              title: config.title(msg.data.order_id),
              message: config.message(msg.data.state),
              color,
            });
          }
        } catch {
          // ignorar mensajes malformados
        }
      };

      ws.onclose = () => {
        if (!wsRef.current) return;
        const delay = Math.min(
          3000 * Math.pow(2, attemptRef.current),
          30000,
        );
        attemptRef.current++;
        reconnectRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [enabled]);
}
