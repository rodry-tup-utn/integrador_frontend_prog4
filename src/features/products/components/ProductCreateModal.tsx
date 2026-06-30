import { useState, useMemo } from "react";
import type { ProductCreate, ProductDetailResponse } from "../types/product";
import {
  Alert,
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
  FileInput,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconPhoto,
  IconTrash,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";
import { CategorySelector } from "../../categories/components/CategorySelector";
import IngredientSelector from "./IngredientSelector";
import {
  mapIngredientToBatchItem,
  validateAll,
} from "../helpers/productValidations";
import { useAdminIngredientsList } from "../../ingredients/hooks/useAdminIngredientsList";
import { useMeasurementUnits } from "../../ingredients/hooks/useMeasurementUnits";
import useImageUpload from "../../upload/hooks/useImageUpload";
import { notifications } from "@mantine/notifications";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreate) => void;
  isSubmitting?: boolean;
  initialData?: ProductDetailResponse;
  keepImages?: boolean;
}

const ProductCreateModal = ({
  opened,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  keepImages = false,
}: Props) => {
  const isEditing = initialData !== undefined;
  const originalType = initialData?.type;

  const [formData, setFormData] = useState<ProductCreate>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    base_price: parseFloat(String(initialData?.base_price)) ?? 0,
    stock: initialData?.stock ?? 0,
    sales_unit: initialData?.sales_unit ?? "",
    images_url: initialData?.images_url ?? [],
    category_id: initialData?.primary_category.id ?? 0,
    type: initialData?.type ?? "FINAL",
    ingredients: initialData?.ingredients?.map(mapIngredientToBatchItem) ?? [],
  });

  const typeChangeWarning =
    isEditing && formData.type !== originalType
      ? formData.type === "MANUFACTURED"
        ? "El stock pasará a calcularse según los ingredientes disponibles."
        : "Los ingredientes serán eliminados y deberás definir el stock manualmente."
      : null;
  const [previews, setPreviews] = useState<string[]>(
    initialData?.images_url ?? [],
  );
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

  const { data: allIngredients } = useAdminIngredientsList({
    offset: 0,
    limit: 1000,
  });
  const { data: measurementUnits } = useMeasurementUnits();
  const { uploadImage, deleteImage } = useImageUpload();

  const calculatedStock = useMemo(() => {
    if (formData.type !== "MANUFACTURED" || formData.ingredients.length === 0)
      return 0;
    const stocks = formData.ingredients.map((item) => {
      const ing = allIngredients?.data.find(
        (i) => i.id === item.ingredient_id,
      );
      if (!ing || ing.stock === null || item.quantity_ingredient === 0)
        return Infinity;
      return Math.floor(ing.stock / item.quantity_ingredient);
    });
    return stocks.length > 0 ? Math.min(...stocks) : 0;
  }, [formData.ingredients, allIngredients, formData.type]);

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
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
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
    const errorMessages = Object.values(newErrors).filter(Boolean);
    if (errorMessages.length > 0) {
      notifications.show({
        title: "Error de validación",
        message: errorMessages.join(".\n "),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
      return;
    }
    const submitData =
      formData.type === "FINAL" ? { ...formData, ingredients: [] } : formData;
    onSubmit(submitData);
  };

  const handleClose = () => {
    if (!keepImages) {
      previews.forEach((url) => {
        const publicId = extractPublicId(url);
        if (publicId) deleteImage(publicId);
      });
    }
    setPreviews([]);
    setFormData((prev) => ({ ...prev, images_url: [] }));
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="80%"
      title={isEditing ? "Editar producto" : "Nuevo Producto"}
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

              <TextInput
                label={
                  formData.type == "FINAL"
                    ? "Stock"
                    : "Stock (se calcula a partir del stock de ingredientes)"
                }
                name="stock"
                type="number"
                required
                readOnly={formData.type == "MANUFACTURED"}
                value={
                  formData.type === "MANUFACTURED"
                    ? (calculatedStock ?? formData.stock)
                    : formData.stock
                }
                onChange={handleChange}
                error={errors.stock}
              />
            </Group>

            <Group gap="md" grow>
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
              <CategorySelector
                label="Categoría"
                isRequired={true}
                value={formData.category_id}
                onChange={handleCategoryChange}
                onlyLeaves
              />
            </Group>
          </Stack>
          <Stack gap={4}>
            <FileInput
              label="Imágenes"
              placeholder="Seleccionar imágenes"
              leftSection={<IconPhoto size={16} />}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              clearable
            />
            {previews.length > 0 && (
              <Group gap={3} justify="space-around">
                {previews.map((url) => (
                  <Stack key={url} gap={3} align="center">
                    <Image
                      p={3}
                      src={url}
                      h={100}
                      w="auto"
                      fit="contain"
                      radius="md"
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleRemoveImage(url)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Stack>
                ))}
              </Group>
            )}
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
            {typeChangeWarning && (
              <Alert
                variant="light"
                color={formData.type === "MANUFACTURED" ? "blue" : "orange"}
                icon={<IconInfoCircle size={16} />}
                py="xs"
                px="md"
              >
                <Text size="sm">{typeChangeWarning}</Text>
              </Alert>
            )}
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
            {isEditing ? "Actualizar Producto" : "Crear Producto"}
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
