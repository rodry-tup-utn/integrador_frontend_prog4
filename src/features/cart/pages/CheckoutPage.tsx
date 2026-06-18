import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Button,
  Paper,
  Stack,
  Group,
  Divider,
  Textarea,
  ActionIcon,
  Badge,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconArrowLeft,
  IconReportMoneyFilled,
} from "@tabler/icons-react";
import { useQueries } from "@tanstack/react-query";
import { useCartStore } from "../store/cart.store";
import { useProfileAddresses } from "../../user/hooks/profile/userProfileAddresses";
import { useClientOrderMutations } from "../../orders/hooks/client/useClientOrderMutations";
import usePaymentMutation from "../../payment/hooks/payment.mutations.hooks";
import { ROUTES } from "../../../shared/constants/routes";
import { productKeys } from "../../products/types/product";
import { productService } from "../../products/services/product.services";
import type { OrderDetailPublic } from "../../orders/types/order";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import { notifications } from "@mantine/notifications";
import CheckoutSuccessCashPending from "../components/CheckoutSuccessCashPending";
import CheckoutSuccessCashConfirmed from "../components/CheckoutSuccessCashConfirmed";
import CheckoutSuccessTransfer from "../components/CheckoutSuccessTransfer";
import CheckoutSuccessMercadoPago from "../components/CheckoutSuccessMercadoPago";
import CheckoutCartItem from "../components/CheckoutCartItem";
import AddressSelector from "../components/AddressSelector";
import PaymentMethodSelector from "../components/PaymentMethodSelector";

type PageMode = "form" | "success";

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
  const { createOrder, isCreating, confirmByClient, isConfirming } =
    useClientOrderMutations();
  const { createCheckout, isCreating: isPaying } = usePaymentMutation();

  const [mode, setMode] = useState<PageMode>("form");
  const [createdOrder, setCreatedOrder] = useState<OrderDetailPublic | null>(
    null,
  );
  const [userSelectedAddressId, setUserSelectedAddressId] = useState<
    number | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("EFECTIVO");
  const [notes, setNotes] = useState("");
  const [isAutoConfirmingCash, setIsAutoConfirmingCash] = useState(false);

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

  useEffect(() => {
    if (
      mode !== "success" ||
      paymentMethod !== "EFECTIVO" ||
      !createdOrder ||
      createdOrder.state_code !== "PENDING"
    ) return;

    setIsAutoConfirmingCash(true);

    const timer = setTimeout(async () => {
      try {
        const confirmed = await confirmByClient(createdOrder.id);
        setCreatedOrder(confirmed);
        notifications.show({ message: "Pedido confirmado — pagás en efectivo al recibir", color: "green" });
      } catch (error) {
        const msg = extractApiErrorMessage(error, "No se pudo confirmar el pedido");
        notifications.show({ message: msg, color: "red" });
      } finally {
        setIsAutoConfirmingCash(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, paymentMethod, createdOrder?.id]);

  if (items.length === 0 && mode === "form") {
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

  const handleCreateOrder = async () => {
    if (!selectedAddressId) return;

    try {
      const newOrder = await createOrder({
        address_id: selectedAddressId,
        payment_method_code: paymentMethod,
        notes: notes || null,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          personalization: i.personalization?.length ? i.personalization : null,
        })),
      });
      clearCart();
      setCreatedOrder(newOrder as unknown as OrderDetailPublic);
      setMode("success");
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(
        error,
        "No se pudo confirmar el pedido",
      );
      notifications.show({ message: msg, color: "red" });
    }
  };

  const handleConfirmCash = async () => {
    if (!createdOrder) return;

    try {
      const confirmed = await confirmByClient(createdOrder.id);
      setCreatedOrder(confirmed);
      notifications.show({ message: "Pedido confirmado 😃", color: "green" });
    } catch (error) {
      const msg = extractApiErrorMessage(
        error,
        "No se pudo confirmar el pedido",
      );
      notifications.show({ message: msg, color: "red" });
    }
  };

  const handlePayMp = async () => {
    if (!createdOrder) return;

    try {
      const preference = await createCheckout(createdOrder.id);
      notifications.show({
        message: "Redirigiendo a Mercado Pago...",
        color: "cyan",
      });
      window.location.href = preference.init_point;
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(error);
      notifications.show({ message: msg, color: "red" });
    }
  };

  if (mode === "success" && createdOrder) {
    const goToOrders = () => navigate(ROUTES.MY_ORDERS);

    if (isAutoConfirmingCash) {
      return (
        <Stack align="center" gap="lg" py="xl">
          <IconShoppingCart size={48} stroke={1} color="green" />
          <Title order={3}>Pedido creado</Title>
          <Text c="dimmed">Estamos confirmando tu pedido...</Text>
          <Button size="lg" loading>Confirmando</Button>
        </Stack>
      );
    }

    if (paymentMethod === "EFECTIVO" && createdOrder.state_code === "PENDING") {
      return (
        <CheckoutSuccessCashPending
          onConfirm={handleConfirmCash}
          isConfirming={isConfirming}
          onGoToOrders={goToOrders}
        />
      );
    }

    if (
      paymentMethod === "EFECTIVO" &&
      createdOrder.state_code === "CONFIRMED"
    ) {
      return <CheckoutSuccessCashConfirmed onGoToOrders={goToOrders} />;
    }

    if (paymentMethod === "TRANSFERENCIA") {
      return <CheckoutSuccessTransfer onGoToOrders={goToOrders} />;
    }

    if (paymentMethod === "MERCADOPAGO") {
      return (
        <CheckoutSuccessMercadoPago
          onPay={handlePayMp}
          isPaying={isPaying}
          onGoToOrders={goToOrders}
        />
      );
    }
  }

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
          {items.map((item, index) => (
            <CheckoutCartItem
              key={item.product.id}
              product={item.product}
              quantity={item.quantity}
              personalization={item.personalization}
              ingredientQuery={ingredientQueries[index]}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onPersonalizationChange={(productId, ingredientId, checked) => {
                const current = item.personalization ?? [];
                setItemPersonalization(
                  productId,
                  checked
                    ? [...current, ingredientId]
                    : current.filter((id) => id !== ingredientId),
                );
              }}
            />
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

      <AddressSelector
        addresses={addresses}
        isLoading={addressesLoading}
        selectedAddressId={selectedAddressId}
        onChange={setUserSelectedAddressId}
      />

      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

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
          onClick={handleCreateOrder}
          loading={isCreating}
          disabled={!selectedAddressId || items.length === 0}
        >
          Crear pedido
        </Button>
      </Group>
    </Stack>
  );
};

export default CheckoutPage;
