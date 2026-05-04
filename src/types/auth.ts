export type UserRole = "USER" | "ADMIN";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  id: number;
  role: UserRole;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export interface AuthContextType {
  user: UserPrivateResponse | null;
  login: (token: string, user: UserInfo) => void;
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
