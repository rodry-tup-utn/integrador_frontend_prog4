import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthContextType } from "../types/auth";
import { useLogin } from "../hooks/useLogin";
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { executeLogin, logout, loading, user } = useLogin();

  return (
    <AuthContext.Provider
      value={{
        user,
        executeLogin,
        logout,
        isAuthenticated: !!user,
        isLoading: loading,
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
