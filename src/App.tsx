import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Toaster } from "sonner";
import { IngredientsPage } from "./features/ingredients/pages/IngredientsPage";
import { AdminRoute } from "./shared/components/AdminRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Si falla la API, reintenta solo una vez
      refetchOnWindowFocus: false, // Evita que se recargue la data cada vez que cambias de pestaña
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton></Toaster>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Rutas de Administrador */}
              <Route element={<AdminRoute />}>
                <Route
                  path="/admin/ingredients"
                  element={<IngredientsPage />}
                ></Route>
              </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
