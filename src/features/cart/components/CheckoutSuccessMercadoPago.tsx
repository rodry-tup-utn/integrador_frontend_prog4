import { Stack, Title, Button, Badge } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";

interface Props {
  onPay: () => void;
  isPaying: boolean;
  onGoToOrders: () => void;
}

const CheckoutSuccessMercadoPago = ({
  onPay,
  isPaying,
  onGoToOrders,
}: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconCash size={48} stroke={1} color="cyan" />
    <Title order={3}>Pedido creado</Title>
    <Badge color="yellow" size="lg">
      Pendiente de pago
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
