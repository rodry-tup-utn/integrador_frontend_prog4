import { useCallback, useState, useMemo } from "react";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import { IconExclamationCircleFilled, IconTrash } from "@tabler/icons-react";
import { useAdminIngredientsList } from "../../ingredients/hooks/useAdminIngredientsList";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";
import {
  type IngredientInProduct,
  type ProductIngredientBatchItem,
} from "../types/product";
import { notifications } from "@mantine/notifications";

interface IngredientSelectorProps {
  value: ProductIngredientBatchItem[];
  onChange: (ingredients: ProductIngredientBatchItem[]) => void;
  ingredients?: IngredientInProduct[];
}

const IngredientSelector = ({ value, onChange }: IngredientSelectorProps) => {
  const [search, setSearch] = useState("");

  const { data: allIngredients } = useAdminIngredientsList({
    offset: 0,
    limit: 1000,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | string>(0);
  const [isRemovable, setIsRemovable] = useState(false);

  const { data: measurementUnits } = useMeasurementUnits();

  const unitSymbolMap = useMemo(
    () => new Map((measurementUnits ?? []).map((u) => [u.code, u.symbol])),
    [measurementUnits],
  );

  const ingredientMap = new Map(
    allIngredients?.data.map((ing) => [ing.id, ing.name]) ?? [],
  );

  const unitCodeMap = new Map(
    allIngredients?.data.map((ing) => [ing.id, ing.measurement_unit_code]) ??
      [],
  );

  const resolveSymbol = useCallback(
    (code: string) => unitSymbolMap.get(code) ?? code,
    [unitSymbolMap],
  );

  const availableIngredients = useMemo(() => {
    const filtered = search
      ? (allIngredients?.data ?? []).filter((ing) =>
          ing.name.toLowerCase().includes(search.toLowerCase()),
        )
      : (allIngredients?.data ?? []);
    return filtered
      .filter((ing) => !value.some((i) => i.ingredient_id === ing.id))
      .slice(0, 10)
      .map((ing) => ({
        value: String(ing.id),
        label: `${ing.name} (${resolveSymbol(ing.measurement_unit_code)})`,
      }));
  }, [allIngredients, search, value, resolveSymbol]);

  const handleAdd = () => {
    if (!selected) return;

    if (Number(quantity) <= 0) {
      notifications.show({
        title: "Error al agregar ingrediente",
        message: "La cantidad de ingrediente a agregar no puede ser 0",
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
      return;
    }

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

  const handleQuantityChange = (
    ingredientId: number,
    newQuantity: number | string,
  ) => {
    const parsed = Number(newQuantity);
    onChange(
      value.map((ing) =>
        ing.ingredient_id === ingredientId
          ? { ...ing, quantity_ingredient: parsed || 0 }
          : ing,
      ),
    );
  };

  const handleRemovableChange = (ingredientId: number, checked: boolean) => {
    onChange(
      value.map((ing) =>
        ing.ingredient_id === ingredientId
          ? { ...ing, is_removable: checked }
          : ing,
      ),
    );
  };

  return (
    <Stack gap="sm">
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
                    {resolveSymbol(unitCodeMap.get(ing.ingredient_id) ?? "")}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Group justify="center">
                    <NumberInput
                      value={ing.quantity_ingredient}
                      min={0}
                      step={
                        unitCodeMap.get(ing.ingredient_id) === "UNIT" ? 1 : 0.25
                      }
                      leftSection={resolveSymbol(
                        unitCodeMap.get(ing.ingredient_id) ?? "",
                      )}
                      onChange={(v) =>
                        handleQuantityChange(ing.ingredient_id, v)
                      }
                      w={130}
                    />
                  </Group>
                </Table.Td>

                <Table.Td
                  ta="center"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Switch
                    size="sm"
                    checked={ing.is_removable}
                    onChange={(evt) =>
                      handleRemovableChange(
                        ing.ingredient_id,
                        evt.currentTarget.checked,
                      )
                    }
                  />
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

      <Group gap="xs">
        <Select
          placeholder="Agregar ingrediente..."
          searchable
          clearable
          data={availableIngredients}
          value={selected ? String(selected) : null}
          onChange={(v) => {
            setSelected(v ? Number(v) : null);
            setSearch("");
          }}
          onSearchChange={setSearch}
          style={{ flex: 1 }}
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
      </Group>
    </Stack>
  );
};

export default IngredientSelector;
