export interface CategoryPath {
  path: string[];
}

export interface CategoryCreate {
  parent_id?: number | null;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

export interface CategoryPublic {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  image_url: string | null;
}

export interface CategoryPrivate extends CategoryPublic {
  created_at: string; // datetime -> ISO string
  updated_at: string | null;
  deleted_at: string | null;
}

export interface CategoryNode {
  id: number;
  name: string;
  parent_id: number | null;
  has_children: boolean;
  children: CategoryNode[];
}

export interface CategoryUpdate {
  name?: string | null;
  description?: string | null;
  image_url?: string | null;
}

export interface CategoryParentUpdate {
  parent_id: number | null;
}

export interface CategoryList {
  data: CategoryPublic[];
  total: number;
}

export interface CategoryListPrivate {
  data: CategoryPrivate[];
  total: number;
}

// QueryFactory
export const categoryKeys = {
  all: ["category"] as const,
  public: () => [...categoryKeys.all, "public"] as const,
  publicLists: () => [...categoryKeys.public(), "list"] as const,
  publicList: (filters: { offset: number; limit: number; search: string }) =>
    [...categoryKeys.publicLists(), filters] as const,
  publicDetails: () => [...categoryKeys.public(), "detail"] as const,
  publicDetail: (id: string) => [...categoryKeys.publicDetails(), id] as const,
  publicPath: (id: number) => [...categoryKeys.public(), "path", id] as const,
  publicTree: () => [...categoryKeys.public(), "tree"] as const,

  admin: () => [...categoryKeys.all, "admin"] as const,
  adminLists: () => [...categoryKeys.admin(), "list"] as const,
  adminList: (filters: { offset: number; limit: number; search: string }) =>
    [...categoryKeys.adminLists(), filters] as const,
  adminDetails: () => [...categoryKeys.admin(), "detail"],
  adminDetail: (id: string) => [...categoryKeys.adminDetails(), id] as const,
};
