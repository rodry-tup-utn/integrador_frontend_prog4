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

export interface IngredientsListFull {
  data: IngredientPrivate[];
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

// QueryFactory
export const ingredientsKeys = {
  all: ["ingredients"] as const,
  public: () => [...ingredientsKeys.all, "public"] as const,
  publicLists: () => [...ingredientsKeys.public(), "list"] as const,
  publicList: (filters: { offset: number; limit: number; search: string }) =>
    [...ingredientsKeys.publicLists(), filters] as const,
  publicDetails: () => [...ingredientsKeys.public(), "detail"] as const,
  publicDetail: (id: string) =>
    [...ingredientsKeys.publicDetails(), id] as const,

  admin: () => [...ingredientsKeys.all, "admin"] as const,
  adminLists: () => [...ingredientsKeys.admin(), "list"] as const,
  adminList: (filters: { offset: number; limit: number; search: string }) =>
    [...ingredientsKeys.adminLists(), filters] as const,
  adminDetails: () => [...ingredientsKeys.admin(), "detail"],
  adminDetail: (id: string | null) =>
    [...ingredientsKeys.adminDetails(), id] as const,
};
