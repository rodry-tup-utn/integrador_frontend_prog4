import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user?.role !== "ADMIN" &&
      !hasNotified.current
    ) {
      toast.error("No tienes permisos de administrador");
      hasNotified.current = true;
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
