import { useState } from "react"
import type { ProductCreate, ProductPrivate } from "../types/product"
import { Button, Group, Select, Textarea, TextInput, Title } from "@mantine/core"
import { useAdminCategoryList } from "../../categories/hooks/useAdminCategoryList"
import { validateAll, validateField } from "../helpers/productValidations"

interface ProductsFormProps {
    editing?: ProductPrivate | null,
    isLoading?: boolean
    handleClose: () => void
    onSubmit: (data: ProductCreate) => void
}

const ProductsForm = ({ editing, isLoading, handleClose, onSubmit }: ProductsFormProps) => {

    const { data } = useAdminCategoryList()

    const [formData, setFormData] = useState<ProductCreate>({
        name: editing?.name ?? "",
        description: editing?.description ?? "",
        base_price: editing?.base_price ?? 0,
        stock: editing?.stock ?? 0,
        images_url: editing?.images_url ?? "",
        category_id: editing?.category_id ?? 0
    })

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        base_price: '',
        stock: '',
        images_url: '',
        category_id: ''
    })

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = evt.target

        if (!name) return

        const newValue = type == "number" ? Number(value) : value

        setFormData(prev => ({ ...prev, [name]: newValue }))
        setErrors(prev => ({ ...prev, [name]: validateField(name, newValue) }))
    }

    const handleSelectChange = (value: string | null) => {
        setFormData(prev => ({ ...prev, category_id: Number(value) }))
        setErrors(prev => ({ ...prev, category_id: validateField("category_id", Number(value)) }))
    }

    const categories = data?.data.map((category) => ({
        value: String(category.id),
        label: category.name
    }))

    const handleSubmit = () => {
        const newErrors = validateAll(formData)
        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some(err => err !== "")

        if (hasErrors) return

        onSubmit(formData)
    }

    return (
        <div className="flex flex-col">
            <div className="w-full flex justify-center items-center mb-6">
                <Title order={4}>{editing == null ? "Nuevo Producto" : "Editar Producto"}</Title>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-cyan-200 shadow-md p-4">
                <section className="col-span-1 md:col-span-2">
                    <TextInput
                        label="Nombre"
                        name="name"
                        placeholder="Pizza especial"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                </section>
                <section className="col-span-1">
                    <TextInput
                        label="Precio"
                        name="base_price"
                        type="number"
                        required
                        value={formData.base_price}
                        onChange={handleChange}
                        leftSection={"$"}
                        error={errors.base_price}
                    />
                </section>
                <section className="col-span-1">
                    <TextInput
                        label="Stock"
                        name="stock"
                        type="number"
                        required
                        value={formData.stock}
                        onChange={handleChange}
                        error={errors.stock}
                    />
                </section>
                <section className="col-span-1 md:col-span-2">
                    <Textarea
                        label="Descripción"
                        name="description"
                        placeholder="Breve descripción del producto"
                        minRows={5}
                        value={formData.description}
                        onChange={handleChange}
                        error={errors.description}
                    />
                </section>
                <section className="col-span-1 md:col-span-2">
                    <TextInput
                        label="Link de la imagen"
                        name="images_url"
                        placeholder="https://cloudinary.com/"
                        value={formData.images_url}
                        onChange={handleChange}
                        error={errors.images_url}
                    />
                </section>
                <section className="col-span-1 md:col-span-2">
                    <Select
                        label="Categorías"
                        name="category_id"
                        withAsterisk
                        placeholder="Seleccioná una categoría..."
                        data={categories}
                        value={String(formData.category_id)}
                        onChange={handleSelectChange}
                        error={errors.category_id}
                    />
                </section>
                <section className="col-span-1 md:col-span-2">
                    <Group justify="flex-end" className="mt-8">
                        <Button variant="subtle" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button loading={isLoading} onClick={handleSubmit}>
                            {editing != null ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </Group>
                </section>
            </form>
        </div>
    )
}

export default ProductsForm