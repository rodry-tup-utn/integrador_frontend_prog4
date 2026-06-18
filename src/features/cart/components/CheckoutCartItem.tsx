import { Stack, Group, Text, Badge, NumberInput, Loader, Checkbox, Paper } from "@mantine/core";
import { IconPaperBag, IconReceiptDollar } from "@tabler/icons-react";
import ActionButton from "../../../shared/components/ActionButton";
import { IconTrash } from "@tabler/icons-react";
import type { ProductPublic } from "../../products/types/product";
import type { IngredientInProduct } from "../../products/types/product";

interface Props {
  product: ProductPublic;
  quantity: number;
  personalization: number[] | null;
  ingredientQuery: {
    isLoading: boolean;
    data?: { ingredients: IngredientInProduct[] };
  };
  onUpdateQuantity: (productId: number, val: number) => void;
  onRemoveItem: (productId: number) => void;
  onPersonalizationChange: (productId: number, ingredientId: number, checked: boolean) => void;
}

const CheckoutCartItem = ({
  product,
  quantity,
  personalization,
  ingredientQuery,
  onUpdateQuantity,
  onRemoveItem,
  onPersonalizationChange,
}: Props) => (
  <Paper key={product.id} withBorder p="sm" radius="md" bg="gray.0">
    <Stack gap="sm">
      <Group justify="space-between" wrap="nowrap">
        <IconPaperBag size={30} stroke={1.75} />
        <Text
          size="md"
          fw={500}
          style={{ flex: 1, letterSpacing: "-0.05em" }}
          tt="uppercase"
          c="orange.9"
        >
          {product.name}
        </Text>
        <Group gap="xs" wrap="nowrap">
          <NumberInput
            value={quantity}
            onChange={(val) => onUpdateQuantity(product.id, Number(val))}
            min={0}
            max={product.stock}
            w={70}
            size="xs"
          />
          <Badge
            variant="light"
            pl="sm"
            fw={600}
            c="green.9"
            w={120}
            ta="right"
            size="xl"
            radius="md"
            leftSection={<IconReceiptDollar />}
          >
            ${(product.base_price * quantity).toLocaleString("es-AR")}
          </Badge>
          <ActionButton
            color="red"
            icon={IconTrash}
            label="Quitar del carrito"
            variant="subtle"
            onClick={() => onRemoveItem(product.id)}
          />
        </Group>
      </Group>

      {ingredientQuery.isLoading && (
        <Group gap="xs" pl="md">
          <Loader size="xs" />
          <Text size="xs" c="dimmed">
            Cargando ingredientes...
          </Text>
        </Group>
      )}

      {ingredientQuery.data?.ingredients.some((ing) => ing.is_removable) && (
        <Paper bg="gray.1" p="xs" withBorder>
          <Stack gap={4} pl="md">
            <Text
              fw={500}
              style={{ letterSpacing: "-0.05em" }}
              mb="md"
              size="sm"
              td="underline"
            >
              Personalizá tu orden:
            </Text>
            {ingredientQuery.data.ingredients
              .filter((ing) => ing.is_removable)
              .map((ing) => (
                <Checkbox
                  key={ing.ingredient_id}
                  size="xs"
                  color="red"
                  label={
                    <Text size="xs">
                      Sin <b>{ing.name}</b>
                    </Text>
                  }
                  checked={personalization?.includes(ing.ingredient_id) ?? false}
                  onChange={() =>
                    onPersonalizationChange(
                      product.id,
                      ing.ingredient_id,
                      !(personalization?.includes(ing.ingredient_id) ?? false),
                    )
                  }
                />
              ))}
          </Stack>
        </Paper>
      )}
    </Stack>
  </Paper>
);

export default CheckoutCartItem;
