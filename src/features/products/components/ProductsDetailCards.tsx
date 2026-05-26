import { ActionIcon, Badge, Button, Divider, Select, Switch, Text, TextInput } from "@mantine/core"
import { IconCheck, IconEdit, IconFolder, IconImageInPicture, IconTrash, IconX } from "@tabler/icons-react"
import { useState } from "react"
import type { ProductDetail } from "../types/product"
import { useProductMutation } from "../hooks/product.mutation.hooks"
import { notifications } from "@mantine/notifications"
import type { AxiosError } from "axios"
import placeholder from '../../../assets/placeholder.jpeg'
import { useProductWithIngredients } from "../hooks/product.queries.hooks"
import { useDebouncedValue } from "@mantine/hooks"
import { useAdminIngredientsList } from "../../ingredients/hooks/useAdminIngredientsList"

export const ProductPriceCard = ({ product }: { product: ProductDetail }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(product.base_price)
    const { updateProduct, isUpdating } = useProductMutation()

    const handleSave = () => {
        updateProduct({ id: product.id, data: { base_price: value } }, {
            onSuccess: () => {
                setIsEditing(false)
                notifications.show({ color: "green", message: "Producto actualizado" })
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ detail: string }>
                const msg = axiosError.response?.data?.detail || "Error al actualizar"
                notifications.show({ color: "red", message: msg })
            }
        })
    }

    return (
        <div className="metric-card flex flex-col gap-2 p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <Text size="sm">Precio Base</Text>
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <TextInput
                        type="number"
                        value={value}
                        onChange={e => setValue(Number(e.target.value))}
                        className="w-full"
                    />
                    <ActionIcon color="teal" onClick={handleSave} loading={isUpdating}>
                        <IconCheck size={20} />
                    </ActionIcon>
                    <ActionIcon color="red" variant="subtle" onClick={() => setIsEditing(false)}>
                        <IconX size={20} />
                    </ActionIcon>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-medium">${Number(value).toLocaleString("es-AR")}</p>
                    <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
                        <IconEdit size={20} />
                    </ActionIcon>
                </div>
            )}
        </div>
    )
}

export const ProductStockCard = ({ product }: { product: ProductDetail }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(product.stock)
    const { updateStock, isUpdating } = useProductMutation()

    const handleSave = () => {
        updateStock({ id: product.id, stock: value }, {
            onSuccess: () => {
                setIsEditing(false)
                notifications.show({ color: "green", message: "Producto actualizado" })
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ detail: string }>
                const msg = axiosError.response?.data?.detail || "Error al actualizar"
                notifications.show({ color: "red", message: msg })
            }
        })
    }

    return (
        <div className="metric-card flex flex-col gap-2 p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <Text size="sm">Stock</Text>
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <TextInput
                        type="number"
                        value={value}
                        onChange={e => setValue(Number(e.target.value))}
                        className="w-full"
                    />
                    <ActionIcon color="teal" onClick={handleSave} loading={isUpdating}>
                        <IconCheck size={20} />
                    </ActionIcon>
                    <ActionIcon color="red" variant="subtle" onClick={() => setIsEditing(false)}>
                        <IconX size={20} />
                    </ActionIcon>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-medium">{value} u.</p>
                    <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
                        <IconEdit size={20} />
                    </ActionIcon>
                </div>
            )}
        </div>
    )
}

export const ProductImageCard = ({ product }: { product: ProductDetail }) => {
    return (
        <div className="metric-card flex flex-col gap-2 p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <IconImageInPicture size={20} />
            <Text size="sm">{`URL: ${product.images_url}`}</Text>
            <div className="flex items-center justify-center">
                <img src={placeholder} />
            </div>
        </div>
    )

}

export const ProductCategoriesCard = ({ product }: { product: ProductDetail }) => {
    return (
        <div className="metric-card flex flex-col gap-2 p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <div className="flex items-center gap-2 mb-4">
                <IconFolder size={20} />
                <Text size="md">Categorías</Text>
            </div>
            <Divider />
            <div className="flex items-center justify-between py-4">
                <Text size="md">Categoría principal</Text>
                <Badge variant="filled" color="dark" size="lg">
                    {product?.primary_category?.name}
                </Badge>
            </div>
            <Divider />
            <div className="flex flex-col py-4">
                <Text size="md" mb={5}>Todas las categorías: </Text>
                <div className="flex flex-wrap gap-2 mt-4">
                    {product.categories.map((cat) => (
                        <Badge variant="filled" color="cyan" key={cat.id} size="md">
                            {cat.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const ProductIngredientsCard = ({ productId }: { productId: number }) => {
    const { data: productWithIngredients } = useProductWithIngredients(productId)
    const [search, setSearch] = useState("")
    const [debouncedSearch] = useDebouncedValue(search, 400)
    const { data: allIngredients } = useAdminIngredientsList(0, 20, debouncedSearch)
    const [selected, setSelected] = useState<number | null>(null)
    const [isRemovable, setIsRemovable] = useState(false)
    const { addIngredient, updateProductIngredient, removeIngredient } = useProductMutation()

    const currentIngredients = productWithIngredients?.ingredients ?? []

    const availableIngredients = allIngredients?.data
        .filter(ing => !currentIngredients.some(i => i.ingredient_id === ing.id))
        .map(ing => ({ value: String(ing.id), label: ing.name })) ?? []

    const handleAdd = () => {
        if (!selected) return
        addIngredient({ productId: productId, ingredientId: selected, data: { is_removable: isRemovable } }, {
            onSuccess: () => {
                setSelected(null);
                setIsRemovable(false)
                notifications.show({ color: "green", message: "Producto actualizado" })
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ detail: string }>
                const msg = axiosError.response?.data?.detail || "Error al actualizar"
                notifications.show({ color: "red", message: msg })
            }
        })

    }

    return (
        <div className="flex flex-col gap-3 metric-card p-4 border border-solid border-zinc-500 rounded-2xl bg-slate-100">
            <p className="text-xs font-medium text-gray-400">Ingredientes</p>

            {currentIngredients.length === 0 && (
                <p className="text-sm text-gray-400">Sin ingredientes cargados</p>
            )}

            {currentIngredients.map(ing => (
                <div key={ing.ingredient_id} className="flex items-center justify-between py-1 border-b border-gray-100">
                    <span className="text-sm font-medium">{ing.name}</span>
                    <div className="flex items-center gap-3">
                        <Switch
                            size="sm"
                            label="Removible"
                            checked={ing.is_removable}
                            onChange={e => updateProductIngredient({ productId: productId, ingredientId: ing.ingredient_id, data: { is_removable: e.currentTarget.checked } }, {
                                onSuccess: () => notifications.show({ color: "green", message: "Regla de personalización actualizada" }),
                                onError: (error) => {
                                    const axiosError = error as AxiosError<{ detail: string }>
                                    const msg = axiosError.response?.data?.detail || "Error al actualizar"
                                    notifications.show({ color: "red", message: msg })
                                }
                            })}
                        />
                        <ActionIcon color="red" variant="subtle"
                            onClick={() => removeIngredient({ productId: productId, ingredientId: ing.ingredient_id })}>
                            <IconTrash size={16} />
                        </ActionIcon>
                    </div>
                </div>
            ))}

            <div className="flex items-center gap-2 mt-2">
                <Select
                    placeholder="Agregar ingrediente..."
                    searchable
                    data={availableIngredients}
                    value={selected ? String(selected) : null}
                    onChange={v => setSelected(v ? Number(v) : null)}
                    onSearchChange={setSearch}
                    className="flex-1"
                />
                <Switch
                    size="sm"
                    label="Removible"
                    checked={isRemovable}
                    onChange={e => setIsRemovable(e.currentTarget.checked)}
                />
                <Button onClick={handleAdd} disabled={!selected}>
                    Agregar
                </Button>
            </div>
        </div>
    )
}
