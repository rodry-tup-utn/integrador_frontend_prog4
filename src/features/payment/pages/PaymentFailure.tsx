import PaymentResultLayout from './PaymentResultLayout'
import { IconCancel } from '@tabler/icons-react';

const PaymentFailure = () => {
    return (
        <PaymentResultLayout
            icon={<IconCancel size={64} className="text-red-600" />}
            title="No pudimos procesar tu pago"
            description='El pago fue rechazado. Podés volver al detalle de tu pedido para intentar nuevamente con otro medio de pago.'
            getStateNote={(stateCode) => {
                if (stateCode === "PENDING") {
                    return "Tu pedido sigue pendiente de pago"
                }
                return null
            }}

        />
    )
}

export default PaymentFailure