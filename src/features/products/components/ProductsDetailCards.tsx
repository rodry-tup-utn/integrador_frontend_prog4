import {
  Badge,
  Center,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Image,
} from "@mantine/core";
import { IconFolder, IconImageInPicture } from "@tabler/icons-react";
import type { IngredientInProduct, ProductDetail } from "../types/product";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";
import placeholder from "../../../assets/placeholder.jpeg";

export const ProductPriceCard = ({ product }: { product: ProductDetail }) => {
  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="sm">Precio Base</Text>
      <Group justify="space-between" align="center">
        <Text size="xl" fw={500}>
          ${Number(product.base_price).toLocaleString("es-AR")}
        </Text>
      </Group>
    </Paper>
  );
};

export const ProductStockCard = ({ product }: { product: ProductDetail }) => {
  const { data: measurementUnits } = useMeasurementUnits();
  const unitSymbol =
    measurementUnits?.find((u) => u.code === product.sales_unit)?.symbol ??
    "u.";

  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="sm">Stock</Text>
      <Group justify="space-between" align="center">
        <Text size="xl" fw={500}>
          {product.stock} {unitSymbol}
        </Text>
      </Group>
    </Paper>
  );
};

export const ProductSalesUnitCard = ({
  product,
}: {
  product: ProductDetail;
}) => {
  const { data: measurementUnits } = useMeasurementUnits();
  const currentUnit = measurementUnits?.find(
    (u) => u.code === product.sales_unit,
  );

  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="sm">Unidad de venta</Text>
      <Group justify="space-between" align="center">
        <Text size="xl" fw={500}>
          {currentUnit ? `${currentUnit.name} (${currentUnit.symbol})` : "—"}
        </Text>
      </Group>
    </Paper>
  );
};

export const ProductImageCard = ({ product }: { product: ProductDetail }) => {
  const src = product.images_url?.[0] || placeholder;
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
        <Image src={src} h={280} fit="contain" />
      </Center>
      <Text
        size="sm"
        c="gray.8"
        ta="center"
      >{`${product.images_url?.length ?? 0} imagen(es)`}</Text>
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
  ingredients,
}: {
  ingredients: IngredientInProduct[];
}) => {
  const { data: measurementUnits } = useMeasurementUnits();
  const unitSymbolMap = new Map(
    (measurementUnits ?? []).map((u) => [u.code, u.name]),
  );
  const resolveSymbol = (code: string) => unitSymbolMap.get(code) ?? code;
  return (
    <Paper
      p="md"
      withBorder
      className="bg-slate-100 rounded-2xl border-zinc-500"
    >
      <Text size="xs" fw={500} c="dimmed">
        Ingredientes
      </Text>
      {ingredients.length === 0 ? (
        <Text size="sm" c="dimmed">
          Sin ingredientes cargados
        </Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th ta="center">Cantidad</Table.Th>
              <Table.Th ta="center">Unidad</Table.Th>
              <Table.Th ta="center">Removible</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {ingredients.map((ing) => (
              <Table.Tr key={ing.ingredient_id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {ing.name}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm">{ing.quantity_ingredient}</Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm">
                    {resolveSymbol(ing.measurement_unit_code)}{" "}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm">{ing.is_removable ? "Sí" : "No"}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
};
