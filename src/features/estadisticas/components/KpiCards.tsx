import { Group, Paper, Text, Title } from "@mantine/core";
import {
  IconCash,
  IconReceipt,
  IconTruckDelivery,
  IconCalendarMonth,
} from "@tabler/icons-react";

interface KpiCardsProps {
  ventasHoy: number;
  ticketPromedio: number | null;
  pedidosActivos: number;
  mesActual: number;
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    value,
  );

const cards = [
  {
    label: "Ventas hoy",
    icon: IconCash,
    color: "teal",
    getValue: (props: KpiCardsProps) => formatCurrency(props.ventasHoy),
  },
  {
    label: "Ticket promedio",
    icon: IconReceipt,
    color: "blue",
    getValue: (props: KpiCardsProps) =>
      props.ticketPromedio !== null
        ? formatCurrency(props.ticketPromedio)
        : "—",
  },
  {
    label: "Pedidos activos",
    icon: IconTruckDelivery,
    color: "violet",
    getValue: (props: KpiCardsProps) => String(props.pedidosActivos),
  },
  {
    label: "Mes actual",
    icon: IconCalendarMonth,
    color: "orange",
    getValue: (props: KpiCardsProps) => formatCurrency(props.mesActual),
  },
];

export const KpiCards = (props: KpiCardsProps) => {
  return (
    <>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Paper key={card.label} shadow="sm" withBorder radius="md" p="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {card.label}
                </Text>
                <Title order={3} mt={4}>
                  {props.isLoading ? "..." : card.getValue(props)}
                </Title>
              </div>
              <Icon size={28} stroke={1.5} color={`var(--mantine-color-${card.color}-6)`} />
            </Group>
          </Paper>
        );
      })}
    </>
  );
};
