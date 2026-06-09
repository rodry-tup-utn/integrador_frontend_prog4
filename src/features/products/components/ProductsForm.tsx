import { useState } from "react";
import type { ProductCreate, ProductPrivate } from "../types/product";
import {
  Button,
  Group,
  SegmentedControl,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { validateAll, validateField } from "../helpers/productValidations";
import { CategoryParentSelector } from "../../categories/components/CategoryParentSelector";
import IngredientSelector from "./IngredientSelector";

interface ProductsFormProps {
  editing?: ProductPrivate | null;
  isLoading?: boolean;
  handleClose: () => void;
  onSubmit: (data: ProductCreate) => void;
}

const ProductsForm = ({
  editing,
  isLoading,
  handleClose,
  onSubmit,
}: ProductsFormProps) => {
  const isEditing = editing != null;

  const [formData, setFormData] = useState<ProductCreate>({
    name: editing?.name ?? "",
    description: editing?.description ?? "",
    base_price: editing?.base_price ?? 0,
    stock: editing?.stock ?? 0,
    images_url: editing?.images_url ?? "",
    category_id: editing?.category_id ?? 0,
    type: editing?.type ?? "FINAL",
    ingredients: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    base_price: "",
    stock: "",
    images_url: "",
    category_id: "",
    type: "",
    ingredients: "",
  });

  const handleChange = (
    evt: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = evt.target;

    if (!name) return;

    const newValue = type == "number" ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
  };

  const handleCategoryChange = (id: number | null) => {
    const value = id ?? 0;
    setFormData((prev) => ({ ...prev, category_id: value }));
    setErrors((prev) => ({
      ...prev,
      category_id: validateField("category_id", value),
    }));
  };

  const handleTypeChange = (value: string) => {
    const type = value as "FINAL" | "MANUFACTURED";
    setFormData((prev) => ({
      ...prev,
      type,
      ingredients: type === "FINAL" ? [] : prev.ingredients,
      stock: type === "MANUFACTURED" ? 0 : prev.stock,
    }));
  };

  const handleIngredientsChange = (
    ingredients: ProductCreate["ingredients"],
  ) => {
    setFormData((prev) => ({ ...prev, ingredients }));
  };

  const handleSubmit = () => {
    const newErrors = validateAll(formData);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");

    if (hasErrors) return;

    onSubmit(formData);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-center items-center mb-6">
        <Title order={4}>
          {editing == null ? "Nuevo Producto" : "Editar Producto"}
        </Title>
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
        {formData.type == "FINAL" && (
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
        )}

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
          <CategoryParentSelector
            label="Categoría"
            value={formData.category_id}
            onChange={handleCategoryChange}
          />
        </section>
        {!isEditing && (
          <>
            <section className="col-span-1 md:col-span-2">
              <SegmentedControl
                fullWidth
                value={formData.type}
                onChange={handleTypeChange}
                data={[
                  { value: "FINAL", label: "Producto Final" },
                  { value: "MANUFACTURED", label: "Manufacturado" },
                ]}
              />
            </section>
            {formData.type === "MANUFACTURED" && (
              <section className="col-span-1 md:col-span-2">
                <IngredientSelector
                  value={formData.ingredients}
                  onChange={handleIngredientsChange}
                />
              </section>
            )}
          </>
        )}
        <section className="col-span-1 md:col-span-2">
          <Group justify="flex-end" className="mt-8">
            <Button variant="subtle" onClick={handleClose}>
              Cancelar
            </Button>
            <Button loading={isLoading} onClick={handleSubmit}>
              {isEditing ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </Group>
        </section>
      </form>
    </div>
  );
};

export default ProductsForm;
