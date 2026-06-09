import type { UserSessionRead } from "../../user/types/user";

export interface RoleInfo {
  role_code: string;
  role_user: {
    code: string;
    name: string;
    description: string;
  };
  assigned_by_id: number;
  expires_at: string | null;
  created_at: string;
}

export interface MeResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roles: RoleInfo[];
  addresses: unknown[];
}

export interface UserInfo {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roles: string[];
}

export interface AuthContextType {
  user: UserInfo | null;
  logout: () => void;
  login: (data: FormData) => Promise<UserSessionRead>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
