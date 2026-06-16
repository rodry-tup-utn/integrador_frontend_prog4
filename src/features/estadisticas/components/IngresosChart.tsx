import { Paper, Text, Title } from "@mantine/core";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FormaPagoIngreso } from "../types/estadisticas";

interface IngresosChartProps {
  data: FormaPagoIngreso[];
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    value,
  );

export const IngresosChart = ({ data, isLoading }: IngresosChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    label: item.descripcion ?? item.forma_pago,
  }));

  return (
    <Paper shadow="sm" withBorder radius="md" p="md">
      <Title order={4} mb="md">
        Ingresos por forma de pago
      </Title>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : chartData.length === 0 ? (
        <Text>Sin datos</Text>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(value as number),
                "Total",
              ]}
            />
            <Bar
              dataKey="total"
              fill="var(--mantine-color-orange-6)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
