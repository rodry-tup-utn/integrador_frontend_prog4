export type MeasurementUnit =
  | "LITER"
  | "MILILITER"
  | "GRAMS"
  | "KILOGRAMS"
  | "UNIT";

export interface IngredientPublic {
  id: number;
  name: string;
  is_allergen: boolean;
  description: string;
  stock: number;
  measurement_unit: MeasurementUnit;
}

export interface IngredientPrivate extends IngredientPublic {
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface IngredientList {
  data: IngredientPublic[];
  total: number;
}

export interface IngredientsListFull {
  data: IngredientPrivate[];
  total: number;
}

export interface IngredientUpdate {
  name?: string;
  description?: string;
  is_allergen?: boolean;
  measurement_unit?: MeasurementUnit;
  stock?: number;
}

export interface IngredientCreate {
  name: string;
  description: string;
  is_allergen: boolean;
  measurement_unit: MeasurementUnit;
  stock: number;
}

export interface IngredientFilters {
  search?: string | null;
  is_allergen?: boolean | null;
  offset?: number;
  limit?: number;
  sort_by?: "name" | "created_at";
  order?: "asc" | "desc";
}

export interface UpdateStockIngredient {
  stock: number;
}

// QueryFactory
export const ingredientsKeys = {
  all: ["ingredients"] as const,
  public: () => [...ingredientsKeys.all, "public"] as const,
  publicLists: () => [...ingredientsKeys.public(), "list"] as const,
  publicList: (filters: IngredientFilters) =>
    [...ingredientsKeys.publicLists(), filters] as const,
  publicDetails: () => [...ingredientsKeys.public(), "detail"] as const,
  publicDetail: (id: string) =>
    [...ingredientsKeys.publicDetails(), id] as const,

  admin: () => [...ingredientsKeys.all, "admin"] as const,
  adminLists: () => [...ingredientsKeys.admin(), "list"] as const,
  adminList: (filters: IngredientFilters) =>
    [...ingredientsKeys.adminLists(), filters] as const,
  adminDetails: () => [...ingredientsKeys.admin(), "detail"],
  adminDetail: (id: string | null) =>
    [...ingredientsKeys.adminDetails(), id] as const,
};
