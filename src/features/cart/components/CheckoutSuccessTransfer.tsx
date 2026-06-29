import {
  Stack,
  Title,
  Text,
  Button,
  Badge,
  Paper,
  Group,
  Divider,
} from "@mantine/core";
import { IconBuildingBank } from "@tabler/icons-react";
import { BANK_TRANSFER_INFO } from "../../../shared/constants/bankData";
import type { OrderPublic, OrderStateCode } from "../../orders/types/order";
import { STATE_COLORS, STATE_LABELS } from "../../orders/types/configs";

interface Props {
  order: OrderPublic;
  onGoToOrders: () => void;
}

const CheckoutSuccessTransfer = ({ order, onGoToOrders }: Props) => (
  <Stack align="center" gap="lg" py="xl">
    <IconBuildingBank size={48} stroke={1} color="blue" />
    <Title order={3}>Pedido creado</Title>
    <Paper
      withBorder
      p="md"
      radius="md"
      bg="gray.0"
      style={{ width: "100%", maxWidth: 400 }}
    >
      <Stack gap="xs">
        <Text fw={600}>Transferencia bancaria</Text>
        <Divider />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Alias:
          </Text>
          <Text size="sm" fw={500}>
            {BANK_TRANSFER_INFO.alias}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            CBU:
          </Text>
          <Text size="sm" fw={500}>
            {BANK_TRANSFER_INFO.cbu}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Titular:
          </Text>
          <Text size="sm" fw={500}>
            {BANK_TRANSFER_INFO.holder}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            CUIL:
          </Text>
          <Text size="sm" fw={500}>
            {BANK_TRANSFER_INFO.cuil}
          </Text>
        </Group>
      </Stack>
    </Paper>
    {order.state_code == "PENDING" && (
      <Text size="sm" c="dimmed" ta="center">
        Un operador verificará el pago y confirmará tu pedido manualmente una
        vez acreditada la transferencia.
      </Text>
    )}

    <Badge
      color={STATE_COLORS[order.state_code as OrderStateCode] || "yellow"}
      size="lg"
    >
      {STATE_LABELS[order.state_code as OrderStateCode] || "Pendiente de pago"}
    </Badge>
    <Button variant="subtle" onClick={onGoToOrders}>
      Ir a mis pedidos
    </Button>
  </Stack>
);

export default CheckoutSuccessTransfer;
