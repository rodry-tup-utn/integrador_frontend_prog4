import type {
  ProductCreate,
  ProductIngredientBatchItem,
  ProductIngredientResponse,
} from "../types/product";

export const validateField = (name: string, value: string | number): string => {
  switch (name) {
    case "name":
      if (typeof value === "string" && !value.trim()) return "El nombre es obligatorio";
      return "";
    case "base_price":
      if (!value || Number(value) <= 0) return "El precio debe ser mayor a 0";
      return "";
    case "stock":
      if (Number(value) < 0) return "El stock no puede ser negativo";
      return "";
    case "description":
      if (typeof value === "string" && !value.trim()) return "La descripción es obligatoria";
      return "";
    case "category_id":
      if (!value || Number(value) === 0) return "Seleccioná una categoría";
      return "";
    default:
      return "";
  }
};

export const validateAll = (data: ProductCreate): Record<keyof ProductCreate, string> => {
  const errors = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, validateField(key, value)]),
  ) as Record<keyof ProductCreate, string>;

  if (data.type === "MANUFACTURED") {
    const hasZero = data.ingredients.some((i) => i.quantity_ingredient <= 0);
    if (hasZero) {
      errors.ingredients =
        "Todos los ingredientes deben tener una cantidad mayor a 0";
    } else if (data.ingredients.length === 0) {
      errors.ingredients = "Debe haber al menos un ingrediente";
    }
  }

  return errors;
};


export const mapIngredientToBatchItem = (ingredient: ProductIngredientResponse): ProductIngredientBatchItem => ({
  ingredient_id: ingredient.ingredient_id,
  is_removable: ingredient.is_removable,
  quantity_ingredient: parseFloat(ingredient.quantity),
});


