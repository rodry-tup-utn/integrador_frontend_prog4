import { Stack, Title, Text, Button, Badge, Paper, Group } from "@mantine/core";
import { IconShoppingCart, IconCash } from "@tabler/icons-react";

interface Props {
  onConfirm: () => void;
  isConfirming: boolean;
  onGoToOrders: () => void;
}

const CheckoutSuccessCashPending = ({ onConfirm, isConfirming, onGoToOrders }: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconShoppingCart size={48} stroke={1} color="green" />
    <Title order={3}>Pedido creado</Title>

    <Paper withBorder p="md" radius="md" w="100%" maw={400} bg="yellow.0" style={{ borderLeft: "4px solid var(--mantine-color-yellow-6)" }}>
      <Group gap="sm">
        <IconCash size={32} stroke={1.5} />
        <Stack gap={0}>
          <Text size="sm" c="dimmed">Medio de pago</Text>
          <Text fw={600}>Efectivo</Text>
          <Text size="sm">Pagás al recibir la orden</Text>
        </Stack>
      </Group>
    </Paper>

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
