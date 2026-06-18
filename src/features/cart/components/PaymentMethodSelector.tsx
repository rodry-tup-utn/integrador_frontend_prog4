import { Paper, Title, Stack, Radio } from "@mantine/core";

const PAYMENT_METHODS = [
  { value: "MERCADOPAGO", label: "Mercado Pago" },
  { value: "TRANSFERENCIA", label: "Transferencia bancaria" },
  { value: "EFECTIVO", label: "Efectivo" },
] as const;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelector = ({ value, onChange }: Props) => (
  <Paper withBorder p="md" radius="md">
    <Title order={4} mb="sm">
      Método de pago
    </Title>
    <Radio.Group value={value} onChange={onChange}>
      <Stack gap="xs">
        {PAYMENT_METHODS.map((pm) => (
          <Radio key={pm.value} value={pm.value} label={pm.label} />
        ))}
      </Stack>
    </Radio.Group>
  </Paper>
);

export default PaymentMethodSelector;
