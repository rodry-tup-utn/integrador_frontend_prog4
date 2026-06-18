import { Stack, Title, Text, Button, Badge } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

interface Props {
  onGoToOrders: () => void;
}

const CheckoutSuccessCashConfirmed = ({ onGoToOrders }: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconCircleCheck size={48} stroke={1} color="green" />
    <Title order={3}>Pedido confirmado</Title>
    <Text c="dimmed">Pagás en efectivo al recibir la orden</Text>
    <Badge color="blue" size="lg">Confirmado</Badge>
    <Button variant="subtle" onClick={onGoToOrders}>
      Ir a mis pedidos
    </Button>
  </Stack>
);

export default CheckoutSuccessCashConfirmed;
