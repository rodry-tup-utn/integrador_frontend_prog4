import PaymentResultLayout from "./PaymentResultLayout"
import { IconCircleCheckFilled } from '@tabler/icons-react';

const PaymentSuccess = () => {
    return (
        <PaymentResultLayout
            icon={<IconCircleCheckFilled size={64} className="text-emerald-600" />}
            title="¡Pago aprobado!"
            description="Tuy pago se procesó correctamente. Pronto vas a recibir la confirmación de tu pedido"
            getStateNote={(stateCode) => {
                if (stateCode === "PENDING") {
                    return "Estamos confirmando tu pago, esto puede demorar unos minutos"
                }
                if (stateCode === "CONFIRMED") {
                    return "¡Tu pedidoo ya fue confirmado!"
                }
                return null
            }}
        />
    )
}

export default PaymentSuccess