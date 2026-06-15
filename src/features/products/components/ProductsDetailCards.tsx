import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Image,
} from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconFolder,
  IconImageInPicture,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { ProductDetail } from "../types/product";
import { useProductMutation } from "../hooks/product.mutation.hooks";
import { notifications } from "@mantine/notifications";
import placeholder from "../../../assets/placeholder.jpeg";
import { useProductWithIngredients } from "../hooks/product.queries.hooks";
import { useDebouncedValue } from "@mantine/hooks";
import { useAdminIngredientsList } from "../../ingredients/hooks/useAdminIngredientsList";
import ActionButton from "../../../shared/components/ActionButton";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

export const ProductPriceCard = ({ product }: { product: ProductDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(product.base_price);
  const { updateProduct, isUpdating } = useProductMutation();

  const handleSave = () => {
    updateProduct(
      { id: product.id, data: { base_price: value } },
      {
        onSuccess: () => {
          setIsEditing(false);
          notifications.show({
            color: "green",
            message: "Producto actualizado",
          });
        },
        onError: (error) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(error, "Error al actualizar"),
          });
        },
      },
    );
  };

  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="sm">Precio Base</Text>
      {isEditing ? (
        <Group gap="sm">
          <TextInput
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full"
          />
          <ActionIcon color="teal" onClick={handleSave} loading={isUpdating}>
            <IconCheck size={20} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => setIsEditing(false)}
          >
            <IconX size={20} />
          </ActionIcon>
        </Group>
      ) : (
        <Group justify="space-between" align="center">
          <Text size="xl" fw={500}>
            ${Number(value).toLocaleString("es-AR")}
          </Text>
          <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
            <IconEdit size={20} />
          </ActionIcon>
        </Group>
      )}
    </Paper>
  );
};

export const ProductStockCard = ({ product }: { product: ProductDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(product.stock);
  const { updateStock, isUpdating } = useProductMutation();

  useEffect(() => {
    if (!isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(product.stock);
    }
  }, [product.stock, isEditing]);

  const handleSave = () => {
    updateStock(
      { id: product.id, stock: value },
      {
        onSuccess: () => {
          setIsEditing(false);
          notifications.show({
            color: "green",
            message: "Producto actualizado",
          });
        },
        onError: (error) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(error, "Error al actualizar"),
          });
        },
      },
    );
  };

  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="sm">Stock</Text>
      {isEditing ? (
        <Group gap="sm">
          <TextInput
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full"
          />
          <ActionIcon color="teal" onClick={handleSave} loading={isUpdating}>
            <IconCheck size={20} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => setIsEditing(false)}
          >
            <IconX size={20} />
          </ActionIcon>
        </Group>
      ) : (
        <Group justify="space-between" align="center">
          <Text size="xl" fw={500}>
            {value} u.
          </Text>
          {product.type == "FINAL" && (
            <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
              <IconEdit size={20} />
            </ActionIcon>
          )}
        </Group>
      )}
    </Paper>
  );
};

export const ProductImageCard = ({ product }: { product: ProductDetail }) => {
  return (
    <Paper
      p="md"
      pos="relative"
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Group>
        <IconImageInPicture size={20} />
        <Text>Imagen</Text>
      </Group>

      <Center>
        <Image src={placeholder} h={280} fit="contain" />
      </Center>
      <Text
        size="sm"
        c="gray.8"
        ta="center"
      >{`URL: ${product.images_url || "Producto sin imagen"}`}</Text>
    </Paper>
  );
};

export const ProductTypeCard = ({ product }: { product: ProductDetail }) => {
  const typeLabel = product.type === "MANUFACTURED" ? "Manufacturado" : "Final";

  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="md">Tipo de producto</Text>
      <Badge variant="filled" color="violet" size="lg">
        {typeLabel}
      </Badge>
    </Paper>
  );
};

export const ProductCategoriesCard = ({
  product,
}: {
  product: ProductDetail;
}) => {
  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Group gap="sm" mb="md">
        <IconFolder size={20} />
        <Text size="md">Categorías</Text>
      </Group>
      <Divider />
      <Group justify="space-between" py="md">
        <Text size="md">Categoría principal</Text>
        <Badge variant="filled" color="dark" size="lg">
          {product?.primary_category?.name}
        </Badge>
      </Group>
      <Divider />
      <Stack py="md">
        <Text size="md" mb={5}>
          Todas las categorías:{" "}
        </Text>
        <Group gap="xs">
          {product.categories.map((cat) => (
            <Badge variant="filled" color="cyan" key={cat.id} size="md">
              {cat.name}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Paper>
  );
};

export const ProductIngredientsCard = ({
  productId,
}: {
  productId: number;
}) => {
  const { data: productWithIngredients } = useProductWithIngredients(productId);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const { data: allIngredients } = useAdminIngredientsList({
    offset: 0,
    limit: 20,
    search: debouncedSearch,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [isRemovable, setIsRemovable] = useState(false);
  const [addQuantity, setAddQuantity] = useState<number | string>(0);
  const [draftQuantities, setDraftQuantities] = useState<
    Record<number, number>
  >({});
  const [draftRemovable, setDraftRemovable] = useState<
    Record<number, boolean>
  >({});
  const { addIngredient, updateProductIngredient, removeIngredient } =
    useProductMutation();

  const currentIngredients = productWithIngredients?.ingredients ?? [];

  const availableIngredients =
    allIngredients?.data
      .filter(
        (ing) => !currentIngredients.some((i) => i.ingredient_id === ing.id),
      )
      .map((ing) => ({ value: String(ing.id), label: ing.name })) ?? [];

  const formatUnit = (unit: string) => {
    const map: Record<string, string> = {
      LITER: "L",
      MILILITER: "ml",
      GRAMS: "g",
      KILOGRAMS: "kg",
      UNIT: "un",
    };
    return map[unit] ?? unit;
  };

  const handleAdd = () => {
    if (!selected) return;
    addIngredient(
      {
        productId: productId,
        ingredientId: selected,
        data: {
          is_removable: isRemovable,
          quantity_ingredient: Number(addQuantity) || 0,
        },
      },
      {
        onSuccess: () => {
          setSelected(null);
          setIsRemovable(false);
          setAddQuantity(0);
          notifications.show({
            color: "green",
            message: "Producto actualizado",
          });
        },
        onError: (error) => {
          notifications.show({
            color: "red",
            message: extractApiErrorMessage(error, "Error al actualizar"),
          });
        },
      },
    );
  };
  const handleUpdate = (
    ingredientId: number,
    qty: number,
    removable: boolean,
  ) => {
    updateProductIngredient(
      {
        productId: productId,
        ingredientId,
        data: { is_removable: removable, quantity_ingredient: qty },
      },
      {
        onSuccess: () => {
          setDraftQuantities((prev) => {
            const next = { ...prev };
            delete next[ingredientId];
            return next;
          });
          setDraftRemovable((prev) => {
            const next = { ...prev };
            delete next[ingredientId];
            return next;
          });
          notifications.show({
            color: "green",
            message: "Regla de personalización actualizada",
          });
        },
        onError: (error) => {
          const msg = extractApiErrorMessage(error);
          notifications.show({ color: "red", message: msg });
        },
      },
    );
  };

  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="xs" fw={500} c="dimmed">
        Ingredientes
      </Text>

      {currentIngredients.length === 0 ? (
        <Text size="sm" c="dimmed">
          Sin ingredientes cargados
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
            {currentIngredients.map((ing) => {
              const draftQty =
                draftQuantities[ing.ingredient_id] ?? ing.quantity_ingredient;
              const draftRemovableValue =
                draftRemovable[ing.ingredient_id] ?? ing.is_removable;
              return (
                <Table.Tr key={ing.ingredient_id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {ing.name}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Text size="sm">{formatUnit(ing.measurement_unit)}</Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Group justify="center">
                      <NumberInput
                        value={draftQty}
                        min={0}
                        w={80}
                        step={ing.measurement_unit == "UNIT" ? 1 : 0.25}
                        onChange={(v) =>
                          setDraftQuantities((prev) => ({
                            ...prev,
                            [ing.ingredient_id]: Number(v) || 0,
                          }))
                        }
                      />
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Group justify="center">
                      <Switch
                        size="sm"
                        checked={draftRemovableValue}
                        onChange={(e) => {
                          const checked = e.currentTarget.checked;
                          setDraftRemovable((prev) => ({
                            ...prev,
                            [ing.ingredient_id]: checked,
                          }));
                        }}
                      />
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Group gap="xs" justify="center">
                      <Button
                        size="xs"
                        variant="light"
                        color="teal"
                        onClick={() =>
                          handleUpdate(
                            ing.ingredient_id,
                            draftQty,
                            draftRemovableValue,
                          )
                        }
                      >
                        Guardar
                      </Button>
                      <ActionButton
                        onClick={() =>
                          removeIngredient({
                            productId: productId,
                            ingredientId: ing.ingredient_id,
                          })
                        }
                        icon={IconTrash}
                        label="Eliminar ingrediente"
                        color="red"
                      ></ActionButton>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}

      <Group gap="sm" mt="xs">
        <Select
          placeholder="Agregar ingrediente..."
          searchable
          data={availableIngredients}
          value={selected ? String(selected) : null}
          onChange={(v) => setSelected(v ? Number(v) : null)}
          onSearchChange={setSearch}
          className="flex-1"
        />
        <NumberInput
          value={addQuantity}
          min={0}
          onChange={setAddQuantity}
          w={80}
        />
        <Switch
          size="sm"
          label="Removible"
          checked={isRemovable}
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setIsRemovable(checked);
          }}
        />
        <Button onClick={handleAdd} disabled={!selected}>
          Agregar
        </Button>
      </Group>
    </Paper>
  );
};
