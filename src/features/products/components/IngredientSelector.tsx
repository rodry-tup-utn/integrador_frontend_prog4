import { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Select,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { useAdminIngredientsList } from "../../ingredients/hooks/useAdminIngredientsList";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";
import type { ProductIngredientBatchItem } from "../types/product";

interface IngredientSelectorProps {
  value: ProductIngredientBatchItem[];
  onChange: (ingredients: ProductIngredientBatchItem[]) => void;
}

const IngredientSelector = ({ value, onChange }: IngredientSelectorProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const { data: allIngredients } = useAdminIngredientsList({
    offset: 0,
    limit: 20,
    search: debouncedSearch,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | string>(0);
  const [isRemovable, setIsRemovable] = useState(false);

  const { data: measurementUnits } = useMeasurementUnits();

  const unitSymbolMap = new Map(
    (measurementUnits ?? []).map((u) => [u.code, u.symbol]),
  );

  const ingredientMap = new Map(
    allIngredients?.data.map((ing) => [ing.id, ing.name]) ?? [],
  );

  const unitCodeMap = new Map(
    allIngredients?.data.map((ing) => [ing.id, ing.measurement_unit_code]) ?? [],
  );

  const resolveSymbol = (code: string) => unitSymbolMap.get(code) ?? code;

  const availableIngredients =
    allIngredients?.data
      .filter((ing) => !value.some((i) => i.ingredient_id === ing.id))
      .map((ing) => ({ value: String(ing.id), label: ing.name })) ?? [];

  const handleAdd = () => {
    if (!selected) return;
    onChange([
      ...value,
      {
        ingredient_id: selected,
        is_removable: isRemovable,
        quantity_ingredient: Number(quantity) || 0,
      },
    ]);
    setSelected(null);
    setIsRemovable(false);
    setQuantity(0);
  };

  const handleRemove = (ingredientId: number) => {
    onChange(value.filter((ing) => ing.ingredient_id !== ingredientId));
  };

  return (
    <div className="flex flex-col gap-3">
      {value.length === 0 ? (
        <Text size="sm" c="dimmed">
          Sin ingredientes seleccionados
        </Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th ta="center">Unidad</Table.Th>
              <Table.Th ta="center">Cantidad</Table.Th>
              <Table.Th ta="center">Removible</Table.Th>
              <Table.Th ta="center">Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {value.map((ing) => (
              <Table.Tr key={ing.ingredient_id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {ingredientMap.get(ing.ingredient_id) ??
                      `ID ${ing.ingredient_id}`}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm">
                    {resolveSymbol(
                      unitCodeMap.get(ing.ingredient_id) ?? "",
                    )}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm">{ing.quantity_ingredient}</Text>
                </Table.Td>

                <Table.Td ta="center">
                  <Switch size="sm" checked={ing.is_removable} readOnly />
                </Table.Td>
                <Table.Td ta="center">
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => handleRemove(ing.ingredient_id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <div className="flex items-center gap-2">
        <Select
          placeholder="Agregar ingrediente..."
          searchable
          data={availableIngredients}
          value={selected ? String(selected) : null}
          onChange={(v) => setSelected(v ? Number(v) : null)}
          onSearchChange={setSearch}
          className="flex-1"
          renderOption={({ option }) => {
            const id = Number(option.value);
            return (
              <Group gap="xs" justify="space-between">
                <Text size="sm">{option.label}</Text>
                <Text size="xs" c="dimmed">
                  {resolveSymbol(unitCodeMap.get(id) ?? "")}
                </Text>
              </Group>
            );
          }}
        />
        <NumberInput value={quantity} min={0} onChange={setQuantity} w={80} />
        <Switch
          size="sm"
          label="Removible"
          checked={isRemovable}
          onChange={(e) => setIsRemovable(e.currentTarget.checked)}
        />
        <Button onClick={handleAdd} disabled={!selected}>
          Agregar
        </Button>
      </div>
    </div>
  );
};

export default IngredientSelector;
