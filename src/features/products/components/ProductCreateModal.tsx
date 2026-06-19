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
  Image,
  ActionIcon,
  SimpleGrid,
  FileInput,
} from "@mantine/core";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { CategorySelector } from "../../categories/components/CategorySelector";
import IngredientSelector from "./IngredientSelector";
import { validateAll } from "../helpers/productValidations";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";
import useImageUpload from "../../upload/hooks/useImageUpload";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

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
    images_url: [],
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
  const { uploadImage, deleteImage } = useImageUpload();
  const [previews, setPreviews] = useState<string[]>([]);

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

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const result = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        images_url: [...(prev.images_url ?? []), result.url],
      }));
      setPreviews((prev) => [...prev, result.url]);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractApiErrorMessage(error, "No se pudo subir la imagen"),
        color: "red",
      });
    }
  };

  const handleRemoveImage = async (url: string) => {
    try {
      const publicId = extractPublicId(url);
      if (publicId) await deleteImage(publicId);
    } catch {
      // si falla el cleanup seguimos igual
    }
    setFormData((prev) => ({
      ...prev,
      images_url: (prev.images_url ?? []).filter((u) => u !== url),
    }));
    setPreviews((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = () => {
    const newErrors = validateAll(formData);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;
    onSubmit(formData);
  };

  const handleClose = () => {
    previews.forEach((url) => {
      const publicId = extractPublicId(url);
      if (publicId) deleteImage(publicId);
    });
    setPreviews([]);
    setFormData((prev) => ({ ...prev, images_url: [] }));
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
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

            <Group gap="md" grow>
              <CategorySelector
                label="Categoría"
                value={formData.category_id}
                onChange={handleCategoryChange}
                showBreadcrumbs
                onlyLeaves
              />

              <Stack gap={3}>
                <FileInput
                  label="Imágenes"
                  placeholder="Seleccionar imágenes"
                  leftSection={<IconPhoto size={16} />}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  clearable
                />
                {previews.length > 0 && (
                  <SimpleGrid cols={3} spacing="xs" mt="xs">
                    {previews.map((url) => (
                      <Stack key={url} gap={3} align="center">
                        <Image
                          src={url}
                          h={80}
                          w="auto"
                          fit="contain"
                          radius="sm"
                        />
                        <ActionIcon
                          color="red"
                          variant="light"
                          size="sm"
                          onClick={() => handleRemoveImage(url)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Stack>
                    ))}
                  </SimpleGrid>
                )}
              </Stack>
            </Group>
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
          <Button variant="subtle" onClick={handleClose}>
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

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
  return match?.[1] ?? null;
}

export default ProductCreateModal;
