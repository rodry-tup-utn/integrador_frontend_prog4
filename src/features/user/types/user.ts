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

export interface UserBase {
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

export interface UserRole {
  role_code: string;
  role_user: RoleRead;
  assigned_by_id: number;
  expires_at?: string | null;
  created_at: string;
}

export interface UserPrivate extends UserBase {
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  roles: RoleRead[];
}

export interface UserDetail extends UserBase {
  roles: UserRole[];
}

export interface UserProfile extends UserBase {
  roles: UserRole[];
  addresses: AddressRead[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserAuthCredentials {
  id: number;
  name: string;
  roles: string[];
  hashed_pass: string;
}

export interface UserList {
  data: UserPrivate[];
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
