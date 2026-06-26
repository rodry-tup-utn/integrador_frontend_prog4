import { Group, Select, Button } from "@mantine/core";
import { IconFilterOff } from "@tabler/icons-react";
import type {
  OrderClientFilters,
  OrderStateCode,
  OrderSortBy,
  OrderDirection,
} from "../types/order";
const STATE_OPTIONS: { value: OrderStateCode; label: string }[] = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "IN_PREP", label: "En preparación" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];
const SORT_OPTIONS: { value: OrderSortBy; label: string }[] = [
  { value: "created_at", label: "Fecha" },
  { value: "subtotal", label: "Subtotal" },
  { value: "id", label: "ID" },
];
const ORDER_OPTIONS: { value: OrderDirection; label: string }[] = [
  { value: "desc", label: "Descendente" },
  { value: "asc", label: "Ascendente" },
];
interface Props {
  filters: OrderClientFilters;
  onChange: (filters: OrderClientFilters) => void;
}
export const OrderFiltersPanel = ({ filters, onChange }: Props) => {
  const update = (partial: Partial<OrderClientFilters>) => {
    onChange({ ...filters, ...partial });
  };
  return (
    <Group gap="sm" mb="md" wrap="wrap">
      <Select
        placeholder="Estado"
        data={STATE_OPTIONS}
        value={filters.state_code || null}
        onChange={(val) => update({ state_code: val as OrderStateCode | null })}
        clearable
        w={{ base: "100%", sm: 180 }}
      />
      <input
        type="date"
        value={filters.date_from || ""}
        onChange={(e) => update({ date_from: e.target.value || null })}
        style={{
          padding: "4px 8px",
          borderRadius: 4,
          border: "1px solid #ced4da",
          width: "100%",
          maxWidth: 200,
          boxSizing: "border-box",
        }}
      />
      <input
        type="date"
        value={filters.date_to || ""}
        onChange={(e) => update({ date_to: e.target.value || null })}
        style={{
          padding: "4px 8px",
          borderRadius: 4,
          border: "1px solid #ced4da",
          width: "100%",
          maxWidth: 200,
          boxSizing: "border-box",
        }}
      />
      <Select
        placeholder="Ordenar por"
        data={SORT_OPTIONS}
        value={filters.sort_by || null}
        onChange={(val) => update({ sort_by: val as OrderSortBy | null })}
        clearable
        w={{ base: "100%", sm: 160 }}
      />
      <Select
        placeholder="Dirección"
        data={ORDER_OPTIONS}
        value={filters.order || null}
        onChange={(val) => update({ order: val as OrderDirection | null })}
        clearable
        w={{ base: "100%", sm: 170 }}
      />
      <Button
        variant="light"
        color="gray"
        leftSection={<IconFilterOff size={16} />}
        onClick={() => onChange({})}
      >
        Limpiar
      </Button>
    </Group>
  );
};
