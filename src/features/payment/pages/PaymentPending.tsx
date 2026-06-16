import PaymentResultLayout from "./PaymentResultLayout"
import { IconStopwatch } from '@tabler/icons-react';


const PaymentPending = () => {
    return (
        <PaymentResultLayout
            icon={<IconStopwatch size={64} className="text-info-600" />}
            title="Tu pago está pendiente"
            description="Estamos esperando la confirmación de tu pago. Te avisaremos cuando se acredite"
            getStateNote={(stateCode) => {
                if (stateCode === "CONFIRMED") {
                    return "¡Buenas noticias! Tu pago ya se acreditó y el pedido está confirmado"
                }
                return null
            }}
        />
    )
}

export default PaymentPending