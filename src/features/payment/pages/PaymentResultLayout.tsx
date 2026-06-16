import { useNavigate, useSearchParams } from "react-router-dom";
import { useClientOrderDetail } from "../../orders/hooks/client/useClientOrderDetail";
import { ROUTES } from "../../../shared/constants/routes";
import { OrderDetailModal } from "../../orders/components/OrderDetailModal";
import { useState } from "react";
import { Button } from "@mantine/core";

interface PaymentResultLayoutPros {
    icon: React.ReactNode;
    title: string;
    description: string;
    getStateNote?: (stateCode: string) => string | null
}

const PaymentResultLayout = ({ icon, title, description, getStateNote }: PaymentResultLayoutPros) => {

    const [openModal, setOpenModal] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();

    const orderIdParam = searchParams.get("order_id");

    const orderId = orderIdParam ? Number(orderIdParam) : null

    const { data: order, isLoading } = useClientOrderDetail(orderId)

    const stateNote = order && getStateNote ? getStateNote(order.state.code) : null


    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center rounded-2xl shadow-2xl bg-background-primary">
                <div className="text-5xl">{icon}</div>

                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>

                {isLoading && <p>Verificando el estado de tu pedido...</p>}

                {stateNote && <p>{stateNote}</p>}

                <div className="flex gap-3 mt-4">
                    {orderId && (
                        <Button onClick={() => setOpenModal(true)}>
                            Ver detalle del pedido
                        </Button>
                    )}
                    <Button onClick={() => navigate(ROUTES.MY_ORDERS)} variant="gradient" color="cyan">
                        Ir a mis pedidos
                    </Button>
                </div>
                <OrderDetailModal
                    order={order || null}
                    isLoading={isLoading}
                    opened={openModal}
                    onClose={() => setOpenModal(false)}
                />
            </div >
        </div>
    )
}

export default PaymentResultLayout