import type { ProductPublic } from '../../features/products/types/product'
import { useCartStore } from '../../features/cart/store/cart.store'
import placeholder from '../../assets/placeholder.jpeg'
import { Badge, Button, Text } from '@mantine/core'
import { IconShoppingCart } from '@tabler/icons-react'
import { useAuth } from '../../features/auth/context/AuthContext'

const ProductCardPublic = ({ product }: { product: ProductPublic }) => {

    const { isAuthenticated } = useAuth()
    const { addItem, items } = useCartStore()
    const inCart = items.some((item) => item.product.id === product.id)

    return (
        <div className="flex flex-col justify-between gap-3 p-4 border border-solid border-zinc-300 rounded-2xl bg-slate-100 hover:shadow-md transition-shadow">
            <img
                // src={product.images_url ?? placeholder}
                src={placeholder}
                alt={product.name}
                className="w-full h-36 object-cover rounded-xl"
            />

            <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <Text fw={600} size="sm" lineClamp={2}>
                        {product.name}
                    </Text>
                    <Badge
                        color={product.available && product.stock > 0 ? "teal" : "red"}
                        variant="light"
                        size="xs"
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {product.available && product.stock > 0
                            ? "Disponible"
                            : "Sin stock"}
                    </Badge>
                </div>

                {product.description && (
                    <Text size="xs" c="dimmed" lineClamp={2}>
                        {product.description}
                    </Text>
                )}
            </div>

            {isAuthenticated && (
                <div className="flex items-center justify-between mt-1">
                    <Text fw={700} size="md" c="teal">
                        ${Number(product.base_price).toLocaleString("es-AR")}
                    </Text>
                    <Button
                        size="xs"
                        variant={inCart ? "light" : "filled"}
                        color="teal"
                        leftSection={<IconShoppingCart size={14} />}
                        disabled={!product.available || product.stock === 0}
                        onClick={() => addItem(product)}
                    >
                        {inCart ? "Agregar más" : "Agregar"}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ProductCardPublic