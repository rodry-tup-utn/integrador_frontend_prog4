// bloque base compartido
export type TypeProduct = "MANUFACTURED" | "FINAL";

interface ProductBase {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  stock: number;
  images_url: string | null;
  available: boolean;
  type: TypeProduct;
}

// tipos de soporte reutilizables
export interface CategorySummary {
  id: number;
  name: string;
  image_url: string | null;
}

// para listas públicas (sin fechas, sin categorías anidadas)
export interface ProductPublic extends ProductBase {
  category_id: number;
}

// para el dashboard de detalle — es el que te faltaba
export interface ProductDetail extends ProductBase {
  primary_category: CategorySummary;
  categories: CategorySummary[];
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// para la tabla de admin (lo que devuelve ProductPrivateList)
export interface ProductPrivate extends ProductBase {
  category_id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ProductCreate {
  name: string;
  description?: string;
  base_price: number;
  stock: number;
  images_url?: string;
  category_id: number;
  type: TypeProduct;
  ingredients: ProductIngredientBatchItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProductUpdate extends Partial<ProductCreate> {}

// listas
export interface ProductList {
  data: ProductPublic[];
  total: number;
}

export interface ProductPrivateList {
  data: ProductPrivate[];
  total: number;
}

// ingredientes
export interface ProductWithIngredients {
  product_id: number;
  name: string;
  ingredients: IngredientInProduct[];
}

export interface IngredientInProduct {
  ingredient_id: number;
  name: string;
  description: string | null;
  is_removable: boolean;
  quantity_ingredient: number;
  measurement_unit_code: string;
}

export interface ProductIngredient {
  is_removable: boolean;
  quantity_ingredient: number;
}

export interface ProductIngredientPublic {
  product_id: number;
  ingredient_id: number;
  is_removable: boolean;
}

export interface ProductIngredientBatchItem {
  ingredient_id: number;
  is_removable: boolean;
  quantity_ingredient: number;
}

export interface ProductIngredientBatchCreate {
  ingredients: ProductIngredientBatchItem[];
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  max_price?: number;
  min_price?: number;
  available?: boolean;
  offset?: number;
  limit?: number;
  sort_by?: "name" | "base_price";
  order?: "asc" | "desc";
}

export const productKeys = {
  all: ["product"] as const,
  list: (filters: ProductFilters = {}) => ["product", "list", filters] as const,
  detail: (id: number) => ["product", "detail", id] as const,
  // admin
  adminAll: (filters: ProductFilters = {}) =>
    ["product", "admin", "list", filters] as const,
  getWithCategory: (id: number) =>
    ["product", "admin", "category", id] as const,
  // Product-Ingredient
  getWithIngredients: (product_id: number) =>
    ["product", "ingredient", "product_id", product_id] as const,
};
