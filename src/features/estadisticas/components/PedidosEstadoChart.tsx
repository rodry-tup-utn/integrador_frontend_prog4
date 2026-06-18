import { Paper, Text, Title } from "@mantine/core";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PedidoEstado } from "../types/estadisticas";

interface PedidosEstadoChartProps {
  data: PedidoEstado[];
  isLoading: boolean;
}

const STATE_COLORS: Record<string, string> = {
  PENDING: "#fbbf24",
  CONFIRMED: "#3b82f6",
  IN_PREP: "#f97316",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

const stateLabel: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  IN_PREP: "En Preparación",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const getColor = (estado: string) => STATE_COLORS[estado] ?? "#6b7280";

const renderLabel = ({ name, percent }: { name?: string; percent?: number }) =>
  `${stateLabel[name as string] ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`;

export const PedidosEstadoChart = ({
  data,
  isLoading,
}: PedidosEstadoChartProps) => {
  const chartData = data.map((item) => ({
    name: item.estado,
    value: item.cantidad,
  }));

  return (
    <Paper shadow="sm" withBorder radius="md" p="md">
      <Title order={4} mb="md">
        Distribución por estado
      </Title>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : chartData.length === 0 ? (
        <Text>Sin datos</Text>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
