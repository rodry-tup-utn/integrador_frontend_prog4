import { useState, useMemo } from "react";
import type { ProductCreate } from "../types/product";
import {
  Button,
  Group,
  Modal,
  SegmentedControl,
  Select,
  Textarea,
  TextInput,
  Stack,
  Paper,
  Text,
} from "@mantine/core";
import { CategorySelector } from "../../categories/components/CategorySelector";
import IngredientSelector from "./IngredientSelector";
import { validateAll } from "../helpers/productValidations";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreate) => void;
  isSubmitting?: boolean;
}

const ProductCreateModal = ({
  opened,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const [formData, setFormData] = useState<ProductCreate>({
    name: "",
    description: "",
    base_price: 0,
    stock: 0,
    sales_unit: "",
    images_url: "",
    category_id: 0,
    type: "FINAL",
    ingredients: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    base_price: "",
    stock: "",
    sales_unit: "",
    images_url: "",
    category_id: "",
    type: "",
    ingredients: "",
  });

  const { data: measurementUnits } = useMeasurementUnits();

  const unitOptions = useMemo(
    () =>
      measurementUnits?.map((u) => ({
        value: u.code,
        label: `${u.name} (${u.symbol})`,
      })) ?? [],
    [measurementUnits],
  );

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = evt.target;
    if (!name) return;
    const newValue = type === "number" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (id: number | null) => {
    const value = id ?? 0;
    setFormData((prev) => ({ ...prev, category_id: value }));
    setErrors((prev) => ({ ...prev, category_id: "" }));
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
    <Modal
      opened={opened}
      onClose={onClose}
      size="70%"
      title="Nuevo Producto"
      centered
    >
      <Stack gap="md">
        <Paper shadow="md" p="md" radius="md" bg="gray.1" withBorder>
          <Stack gap="md">
            <Text size="md" fw={700}>
              Datos del Producto
            </Text>

            <TextInput
              label="Nombre"
              name="name"
              placeholder="Pizza especial"
              required
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Textarea
              label="Descripción"
              name="description"
              placeholder="Breve descripción del producto"
              minRows={3}
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
            />

            <Group justify="center" grow>
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

              {formData.type === "FINAL" && (
                <TextInput
                  label="Stock"
                  name="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  error={errors.stock}
                />
              )}

              <Select
                label="Unidad de venta"
                placeholder="Seleccionar unidad"
                data={unitOptions}
                value={formData.sales_unit || null}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, sales_unit: value ?? "" }))
                }
                clearable
                searchable
              />
            </Group>

            <TextInput
              label="Link de la imagen"
              name="images_url"
              placeholder="https://cloudinary.com/"
              value={formData.images_url}
              onChange={handleChange}
              error={errors.images_url}
            />

            <CategorySelector
              label="Categoría"
              value={formData.category_id}
              onChange={handleCategoryChange}
              showBreadcrumbs
              onlyLeaves
            />
          </Stack>
        </Paper>

        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Stack gap="md">
            <Text size="md" fw={700}>
              Tipo de Producto
            </Text>
            <SegmentedControl
              color={formData.type == "FINAL" ? "orange" : "blue"}
              variant="light"
              fullWidth
              value={formData.type}
              onChange={handleTypeChange}
              data={[
                { value: "FINAL", label: "Producto Final" },
                { value: "MANUFACTURED", label: "Manufacturado" },
              ]}
            />

            {formData.type === "MANUFACTURED" && (
              <IngredientSelector
                value={formData.ingredients}
                onChange={handleIngredientsChange}
              />
            )}
          </Stack>
        </Paper>

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Crear Producto
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ProductCreateModal;
