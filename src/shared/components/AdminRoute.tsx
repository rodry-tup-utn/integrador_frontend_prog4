import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

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
      toast.error("No tienes permisos de administrador para acceder aquí");
      hasNotified.current = true;
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Verificando permisos...
      </div>
    );

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
