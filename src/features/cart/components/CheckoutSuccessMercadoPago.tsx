import { Stack, Title, Button, Badge } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";
import type { OrderPublic, OrderStateCode } from "../../orders/types/order";
import { STATE_COLORS, STATE_LABELS } from "../../orders/types/configs";

interface Props {
  order: OrderPublic;
  onPay: () => void;
  isPaying: boolean;
  onGoToOrders: () => void;
}

const CheckoutSuccessMercadoPago = ({
  order,
  onPay,
  isPaying,
  onGoToOrders,
}: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconCash size={48} stroke={1} color="cyan" />
    <Title order={3}>Pedido creado</Title>
    <Badge
      color={STATE_COLORS[order.state_code as OrderStateCode] || "yellow"}
      size="lg"
    >
      {STATE_LABELS[order.state_code as OrderStateCode] || "Pendiente de pago"}
    </Badge>
    <Button size="lg" color="cyan" onClick={onPay} loading={isPaying}>
      Pagar con MercadoPago
    </Button>
    <Button variant="subtle" onClick={onGoToOrders}>
      Ir a mis pedidos
    </Button>
  </Stack>
);

export default CheckoutSuccessMercadoPago;
