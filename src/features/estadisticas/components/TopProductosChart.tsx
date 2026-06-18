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
import type { ProductoTop } from "../types/estadisticas";

interface TopProductosChartProps {
  data: ProductoTop[];
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    value,
  );

const truncate = (name: string, max: number) =>
  name.length > max ? `${name.slice(0, max)}...` : name;

export const TopProductosChart = ({ data, isLoading }: TopProductosChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    nombreTruncado: truncate(item.nombre, 15),
  }));

  return (
    <Paper shadow="sm" withBorder radius="md" p="md">
      <Title order={4} mb="md">
        Top productos
      </Title>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : chartData.length === 0 ? (
        <Text>Sin datos</Text>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreTruncado" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [
                formatCurrency(value as number),
                "Ingresos",
              ]}
              labelFormatter={(label) => label}
            />
            <Bar
              dataKey="ingresos_totales"
              fill="var(--mantine-color-violet-6)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
