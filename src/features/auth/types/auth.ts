export type UserRole = "USER" | "ADMIN";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

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
  login: (user: UserInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface UserPrivateResponse {
  id: string;
  name: string;
  lastname: string;
  phone_number: string | null;
  email: string;
  role: UserRole;
}
