import { useParams } from "react-router-dom";
import { useClientOrderDetail } from "../../orders/hooks/client/useClientOrderDetail";
import usePaymentMutation from "../hooks/payment.mutations.hooks";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

const PaymentCheckout = () => {
  const { order_id } = useParams<{ order_id: string }>();

  const id = order_id ? Number(order_id) : null;

  const { data: order, isLoading: isOrderLoading } = useClientOrderDetail(id);
  const { createCheckout, isCreating } = usePaymentMutation();

  const handlePay = async () => {
    if (!order) return;

    try {
      const preference = await createCheckout(order.id);

      console.log("PREFERENCE", preference);
      notifications.show({ message: "Pago iniciado", color: "teal" });
      window.location.href = preference.init_point;
    } catch (error: unknown) {
      const msg = extractApiErrorMessage(error);
      console.log(error);
      notifications.show({ message: msg, color: "red" });
    }
  };

  if (isOrderLoading) {
    // cargando
  }

  if (!order) {
    // No se encuentra la orden
  }

  const payWithMP = order?.payment_method_code === "MERCADOPAGO";
  const hasDiscount = Number(order?.discount) > 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Orden #{order?.id}
            </h1>
            <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
              Estado:
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {order?.state.description}
              </span>
            </p>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Productos
            </h2>
            <ul className="divide-y divide-gray-100">
              {order?.items.map((item) => (
                <li
                  key={item.product_id}
                  className="py-3 flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    <span className="font-semibold text-gray-900">
                      {item.quantity}x
                    </span>{" "}
                    {item.name_snap}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${item.subtotal_snap}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ${order?.subtotal}
              </span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento</span>
                <span>-${order?.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-medium text-gray-900">
                ${order?.shipping_cost}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Resumen de Compra
          </h2>

          <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6 flex justify-between items-center">
            <span className="text-base font-medium text-gray-700">
              Total a pagar:
            </span>
            <span className="text-3xl font-extrabold text-gray-900">
              $
              {Number(order?.subtotal) -
                Number(order?.discount) +
                Number(order?.shipping_cost)}
            </span>
          </div>

          <div className="w-ful flex flex-col justify-center items-center">
            {payWithMP && (
              <Button
                onClick={handlePay}
                size="lg"
                variant="filled"
                color="cyan"
                disabled={isCreating}
                className="mb-3"
              >
                {isCreating ? "Redirigiendo..." : "Ir a pagar"}
              </Button>
            )}

            <p className="text-xs text-gray-500 text-center mb-4">
              Vas a ser redirigido a la plataforma segura de Mercado Pago para
              completar tu transacción.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
