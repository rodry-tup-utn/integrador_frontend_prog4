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
  executeLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
