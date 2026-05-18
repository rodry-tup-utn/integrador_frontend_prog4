import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { notifications } from "@mantine/notifications";

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      !user?.roles.includes("ADMIN") &&
      !hasNotified.current
    ) {
      notifications.show({
        title: "Error de autorizacion",
        message: "No tienes permisos de administrador",
        color: "orange",
      });
      hasNotified.current = true;
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!isAuthenticated || !user?.roles.includes("ADMIN")) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};
