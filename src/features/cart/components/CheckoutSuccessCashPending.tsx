import { Stack, Title, Text, Button, Badge } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

interface Props {
  onConfirm: () => void;
  isConfirming: boolean;
  onGoToOrders: () => void;
}

const CheckoutSuccessCashPending = ({ onConfirm, isConfirming, onGoToOrders }: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconShoppingCart size={48} stroke={1} color="green" />
    <Title order={3}>Pedido creado</Title>
    <Text c="dimmed">Pagás en efectivo al recibir el pedido</Text>
    <Badge color="yellow" size="lg">Pendiente de confirmación</Badge>
    <Button size="lg" onClick={onConfirm} loading={isConfirming}>
      Confirmar pedido
    </Button>
    <Button variant="subtle" onClick={onGoToOrders}>
      Ir a mis pedidos
    </Button>
  </Stack>
);

export default CheckoutSuccessCashPending;
