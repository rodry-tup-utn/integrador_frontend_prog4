import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthContextType } from "../../../types/auth";
import { useAuthState } from "../hooks/useAuthState";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthState();

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        login: auth.login,
        logout: auth.logout,
        isAuthenticated: !!auth.user,
        isLoading: auth.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
