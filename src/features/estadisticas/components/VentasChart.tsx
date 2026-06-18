import { Paper, Text, Title } from "@mantine/core";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VentaPeriodo } from "../types/estadisticas";

interface VentasChartProps {
  data: VentaPeriodo[];
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    value,
  );

export const VentasChart = ({ data, isLoading }: VentasChartProps) => {
  return (
    <Paper shadow="sm" withBorder radius="md" p="md">
      <Title order={4} mb="md">
        Ventas por período
      </Title>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : data.length === 0 ? (
        <Text>Sin datos</Text>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "total") return [formatCurrency(value as number), "Total ventas"];
                return [value as number, "Cant. pedidos"];
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="total"
              stroke="var(--mantine-color-teal-6)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="cantidad_pedidos"
              name="cantidad_pedidos"
              stroke="var(--mantine-color-blue-6)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
