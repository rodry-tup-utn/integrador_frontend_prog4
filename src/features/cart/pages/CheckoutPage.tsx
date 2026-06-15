import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Button,
  Paper,
  Stack,
  Group,
  Divider,
  Radio,
  Textarea,
  NumberInput,
  ActionIcon,
  Loader,
  Alert,
  Checkbox,
  Badge,
} from "@mantine/core";
import {
  IconTrash,
  IconShoppingCart,
  IconAlertCircle,
  IconArrowLeft,
  IconPaperBag,
  IconReceiptDollar,
  IconReportMoneyFilled,
} from "@tabler/icons-react";
import { useQueries } from "@tanstack/react-query";
import { useCartStore } from "../store/cart.store";
import { useProfileAddresses } from "../../user/hooks/profile/userProfileAddresses";
import { useClientOrderMutations } from "../../orders/hooks/client/useClientOrderMutations";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { ROUTES } from "../../../shared/constants/routes";
import { productKeys } from "../../products/types/product";
import { productService } from "../../products/services/product.services";
import ActionButton from "../../../shared/components/ActionButton";

const PAYMENT_METHODS = [
  { value: "MERCADOPAGO", label: "Mercado Pago" },
  { value: "TRANSFERENCIA", label: "Transferencia bancaria" },
  { value: "EFECTIVO", label: "Efectivo" },
] as const;

const CheckoutPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    setItemPersonalization,
    getTotalPrice,
    clearCart,
  } = useCartStore();
  const navigate = useNavigate();
  const { data: addresses, isLoading: addressesLoading } =
    useProfileAddresses();
  const { createOrder, isCreating } = useClientOrderMutations();

  const [userSelectedAddressId, setUserSelectedAddressId] = useState<
    number | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("EFECTIVO");
  const [notes, setNotes] = useState("");

  const selectedAddressId =
    userSelectedAddressId ??
    addresses?.find((a) => a.is_main)?.id ??
    addresses?.[0]?.id ??
    null;

  const ingredientQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: productKeys.getWithIngredients(item.product.id),
      queryFn: () =>
        productService.productIngredient.getProductWithIngredients(
          item.product.id,
        ),
      staleTime: 5 * 60 * 1000,
    })),
  });

  if (items.length === 0) {
    return (
      <Stack align="center" gap="lg" py="xl">
        <IconShoppingCart size={64} stroke={1} color="gray" />
        <Title order={3} c="dimmed">
          Tu carrito está vacío
        </Title>
        <Button component={Link} to={ROUTES.PUBLIC_PRODUCTS} variant="light">
          Ver productos
        </Button>
      </Stack>
    );
  }

  const total = getTotalPrice();

  const handleConfirm = async () => {
    if (!selectedAddressId) return;

    showConfirm({
      title: "¿Confirmar pedido?",
      confirmLabel: "Confirmar",
      color: "teal",
      onConfirm: async () => {
        const newOrder = await createOrder({
          address_id: selectedAddressId,
          payment_method_code: paymentMethod,
          notes: notes || null,
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            personalization: i.personalization?.length
              ? i.personalization
              : null,
          })),
        });
        clearCart();
        navigate(`/checkout/payment/${newOrder.id}`);
      },
      successMessage: "Pedido realizado con éxito",
    });
  };

  return (
    <Stack gap="lg">
      <Group>
        <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Confirmar pedido</Title>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">
          Resumen del pedido
        </Title>
        <Stack gap="md">
          {items.map(({ product, quantity, personalization }, index) => (
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
                      onChange={(val) =>
                        updateQuantity(product.id, Number(val))
                      }
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
                      onClick={() => removeItem(product.id)}
                    />
                  </Group>
                </Group>

                {ingredientQueries[index]?.isLoading && (
                  <Group gap="xs" pl="md">
                    <Loader size="xs" />
                    <Text size="xs" c="dimmed">
                      Cargando ingredientes...
                    </Text>
                  </Group>
                )}

                {ingredientQueries[index]?.data?.ingredients.some(
                  (ing) => ing.is_removable,
                ) && (
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
                      {ingredientQueries[index]
                        .data!.ingredients.filter((ing) => ing.is_removable)
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
                            checked={
                              personalization?.includes(ing.ingredient_id) ??
                              false
                            }
                            onChange={() => {
                              const current = personalization ?? [];
                              if (current.includes(ing.ingredient_id)) {
                                setItemPersonalization(
                                  product.id,
                                  current.filter(
                                    (id) => id !== ing.ingredient_id,
                                  ),
                                );
                              } else {
                                setItemPersonalization(product.id, [
                                  ...current,
                                  ing.ingredient_id,
                                ]);
                              }
                            }}
                          />
                        ))}
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
        <Divider my="sm" />
        <Group justify="space-between">
          <Text fw={600}>Total</Text>
          <Badge
            variant="light"
            pl="sm"
            fw={600}
            c="green.9"
            w={120}
            ta="right"
            size="xl"
            radius="md"
            leftSection={<IconReportMoneyFilled />}
          >
            {Number(total).toLocaleString("es-AR")}
          </Badge>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">
          Dirección de envío
        </Title>
        {addressesLoading ? (
          <Loader size="sm" />
        ) : addresses && addresses.length > 0 ? (
          <Radio.Group
            value={String(selectedAddressId)}
            onChange={(v) => setUserSelectedAddressId(Number(v))}
          >
            <Stack gap="xs">
              {addresses.map((addr) => (
                <Radio
                  key={addr.id}
                  value={String(addr.id)}
                  label={`${addr.alias} — ${addr.line_one}, ${addr.city}, ${addr.province}`}
                />
              ))}
            </Stack>
          </Radio.Group>
        ) : (
          <Alert icon={<IconAlertCircle size={16} />} color="yellow">
            No tenés direcciones cargadas.{" "}
            <Text component={Link} to={ROUTES.PROFILE} td="underline">
              Agregá una desde tu perfil
            </Text>
          </Alert>
        )}
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">
          Método de pago
        </Title>
        <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
          <Stack gap="xs">
            {PAYMENT_METHODS.map((pm) => (
              <Radio key={pm.value} value={pm.value} label={pm.label} />
            ))}
          </Stack>
        </Radio.Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">
          Notas (opcional)
        </Title>
        <Textarea
          placeholder="Agregá notas extras a tu pedido"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          maxLength={500}
          autosize
          minRows={2}
          maxRows={4}
        />
      </Paper>

      <Group justify="space-between" mt="md">
        <Button variant="subtle" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Button
          size="lg"
          onClick={handleConfirm}
          loading={isCreating}
          disabled={!selectedAddressId || items.length === 0}
        >
          Confirmar pedido
        </Button>
      </Group>
    </Stack>
  );
};

export default CheckoutPage;
