export type UserRole = "USER" | "ADMIN";

export interface UserInfo {
  id: number;
  role: UserRole;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export interface AuthContextType {
  user: UserInfo | null;
  login: (user: UserInfo, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserPrivateResponse {
  id: string;
  name: string;
  lastname: string;
  phone_number: string | null;
  email: string;
  role: UserRole;
}
