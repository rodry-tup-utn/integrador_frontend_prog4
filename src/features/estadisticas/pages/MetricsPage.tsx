import { useState } from "react";
import { Group, SimpleGrid, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { useResumen } from "../hooks/useResumen";
import { useVentas } from "../hooks/useVentas";
import { useProductosTop } from "../hooks/useProductosTop";
import { usePedidosEstado } from "../hooks/usePedidosEstado";
import { useIngresos } from "../hooks/useIngresos";
import { KpiCards } from "../components/KpiCards";
import { VentasChart } from "../components/VentasChart";
import { TopProductosChart } from "../components/TopProductosChart";
import { PedidosEstadoChart } from "../components/PedidosEstadoChart";
import { IngresosChart } from "../components/IngresosChart";

const today = new Date();
const todayStr = today.toISOString().split("T")[0];
const monthStartStr = `${todayStr.slice(0, 7)}-01`;
const todayEndStr = `${todayStr}T23:59:59`;
const todayStartStr = `${todayStr}T00:00:00`;
const monthStartISO = `${monthStartStr}T00:00:00`;

const ACTIVE_STATES = ["CONFIRMED", "IN_PREP"];

export const MetricsPage = () => {
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);

  const { data: resumen, isLoading: resumenLoading } = useResumen();
  const { data: ventasHoy } = useVentas({
    desde: todayStartStr,
    hasta: todayEndStr,
    agrupacion: "day",
  });
  const { data: mesActual } = useVentas({
    desde: monthStartISO,
    hasta: today.toISOString(),
    agrupacion: "month",
  });

  const ventasFilters =
    dateRange[0] && dateRange[1]
      ? {
          desde: new Date(dateRange[0]).toISOString(),
          hasta: new Date(dateRange[1]).toISOString(),
        }
      : undefined;

  const { data: ventas, isLoading: ventasLoading } = useVentas(ventasFilters);
  const { data: productosTop, isLoading: productosLoading } = useProductosTop();
  const { data: pedidosEstado, isLoading: pedidosLoading } = usePedidosEstado();
  const { data: ingresos, isLoading: ingresosLoading } =
    useIngresos(ventasFilters);

  const ventasHoyTotal =
    ventasHoy?.reduce((acc, v) => acc + Number(v.total), 0) ?? 0;
  const mesActualTotal =
    mesActual?.reduce((acc, v) => acc + Number(v.total), 0) ?? 0;
  const pedidosActivos = resumen?.ordenes_por_estado
    ? Object.entries(resumen.ordenes_por_estado)
        .filter(([key]) => ACTIVE_STATES.includes(key))
        .reduce((acc, [, val]) => acc + val, 0)
    : 0;

  return (
    <>
      <Title order={2} mb="lg">
        Métricas
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        <KpiCards
          ventasHoy={ventasHoyTotal}
          ticketPromedio={resumen?.promedio_orden ?? null}
          pedidosActivos={pedidosActivos}
          mesActual={mesActualTotal}
          isLoading={resumenLoading}
        />
      </SimpleGrid>

      <Group mb="md" align="end">
        <DatePickerInput
          type="range"
          placeholder="Filtrar por fecha"
          leftSection={<IconCalendar size={16} />}
          value={dateRange}
          onChange={setDateRange}
          clearable
        />
      </Group>

      <SimpleGrid cols={{ base: 1, lg: 2 }} mb="lg">
        <VentasChart data={ventas ?? []} isLoading={ventasLoading} />
        <TopProductosChart
          data={productosTop ?? []}
          isLoading={productosLoading}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <PedidosEstadoChart
          data={pedidosEstado ?? []}
          isLoading={pedidosLoading}
        />
        <IngresosChart
          data={ingresos?.por_forma_pago ?? []}
          isLoading={ingresosLoading}
        />
      </SimpleGrid>
    </>
  );
};
