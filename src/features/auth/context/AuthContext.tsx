import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { UserInfo, AuthContextType, MeResponse } from "../types/auth";
import { authService } from "../services/authService";

const toUserInfo = (data: MeResponse): UserInfo => ({
  id: data.id,
  name: data.name,
  lastname: data.lastname,
  email: data.email,
  roles: data.roles.map((r) => r.role_code),
});

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    authService
      .getMe()
      .then((data) => setUser(toUserInfo(data)))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (formData: FormData): Promise<UserInfo | null> => {
    try {
      await authService.login(formData);
      const data = await authService.getMe();
      const info = toUserInfo(data);
      setUser(info);
      return info;
    } catch {
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    authService.logout().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
