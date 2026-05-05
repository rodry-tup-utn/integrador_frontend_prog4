import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
