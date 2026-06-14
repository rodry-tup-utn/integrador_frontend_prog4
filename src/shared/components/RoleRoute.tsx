import { useEffect, useRef } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { notifications } from "@mantine/notifications";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
  errorMessage?: string;
}
export const RoleRoute = ({ allowedRoles, errorMessage }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasNotified = useRef(false);
  const hasRole = allowedRoles.some((role) => user?.roles.includes(role));
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole && !hasNotified.current) {
      notifications.show({
        title: "Error de autorización",
        message:
          errorMessage || "No tienes permisos para acceder a esta sección",
        color: "orange",
      });
      hasNotified.current = true;
    }
  }, [isAuthenticated, user, hasRole, errorMessage, isLoading]);
  if (isLoading) return <p>Cargando sesión...</p>;
  if (!isAuthenticated || !hasRole) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
};
