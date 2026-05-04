export interface IngredientPublic {
  id: number;
  name: string;
  is_allergen: boolean;
  description: string;
}

export interface IngredientPrivate {
  id: number;
  name: string;
  description: string;
  is_allergen: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface IngredientList {
  data: IngredientPublic[];
  total: number;
}

export interface IngredientUpdate {
  name?: string;
  description?: string;
  is_allergen?: boolean;
}

export interface IngredientCreate {
  name: string;
  description: string;
  is_allergen: boolean;
}
