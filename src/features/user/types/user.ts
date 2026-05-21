export interface UserCreate {
  name: string;
  lastname: string;
  email: string;
  phone_number?: string | null;
  password: string;
}

export interface UserCreateByAdmin extends UserCreate {
  role_code: string;
}

export interface UserResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
}

export interface UserUpdate {
  name?: string | null;
  lastname?: string | null;
  phone_number?: string | null;
  email?: string | null;
}

export interface RoleRead {
  code: string;
  name: string;
  description: string;
}

export interface AddressRead {
  id: number;
  alias: string;
  line_one: string;
  line_two?: string | null;
  city: string;
  province: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  is_main: boolean;

  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AddressUpdate {
  alias?: string | null;
  line_one?: string | null;
  line_two?: string | null;
  city?: string | null;
  province?: string | null;
  zip_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_main?: boolean | null;
}

export interface AddressCreate {
  alias: string;
  line_one: string;
  line_two?: string | null;
  city: string;
  province: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  is_main?: boolean | null;
}

export interface UserRoleRead {
  role_user: RoleRead;
  assigned_by_id: number;
  expires_at?: string | null;
  created_at: string;
}

export interface UserAdminRead extends UserResponse {
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  roles: UserRoleRead[];
}

export interface UserDetailRead extends UserResponse {
  roles: UserRoleRead[];
}

export interface UserProfileRead extends UserResponse {
  roles: UserRoleRead[];
  addresses: AddressRead[];
}

export interface TokenPayloadData {
  id: number;
  name: string;
  roles: string[];
}

export interface UserSessionRead extends UserResponse {
  roles: string[];
}

export interface UserPaginatedRead {
  data: UserAdminRead[];
  total: number;
}
export const userKeys = {
  all: ["users"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  addresses: () => [...userKeys.profile(), "addresses"] as const,
  adminList: (filters: { offset: number; limit: number; search: string }) =>
    [...userKeys.all, "admin", filters] as const,
  adminDetail: (id: string) => [...userKeys.all, "admin", id] as const,
};
