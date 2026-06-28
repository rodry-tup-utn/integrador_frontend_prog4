import { Stack, Title, Text, Button, Badge, Paper, Group } from "@mantine/core";
import { IconCircleCheck, IconCash } from "@tabler/icons-react";

interface Props {
  onGoToOrders: () => void;
}

const CheckoutSuccessCashConfirmed = ({ onGoToOrders }: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconCircleCheck size={48} stroke={1} color="green" />
    <Title order={3}>Pedido confirmado</Title>

    <Paper withBorder p="md" radius="md" w="100%" maw={400} bg="green.0" style={{ borderLeft: "4px solid var(--mantine-color-green-6)" }}>
      <Group gap="sm">
        <IconCash size={32} stroke={1.5} />
        <Stack gap={0}>
          <Text size="sm" c="dimmed">Medio de pago</Text>
          <Text fw={600}>Efectivo</Text>
          <Text size="sm">Pagás al recibir la orden</Text>
        </Stack>
      </Group>
    </Paper>

    <Badge color="green" size="lg">Confirmado</Badge>
    <Button variant="subtle" onClick={onGoToOrders}>
      Ir a mis pedidos
    </Button>
  </Stack>
);

export default CheckoutSuccessCashConfirmed;
