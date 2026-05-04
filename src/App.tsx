import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { Toaster } from "sonner";
import { IngredientsPage } from "./modules/ingredients/pages/ingredientPage";
import { AdminRoute } from "./components/AdminRoute";

function App() {
  return (
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
  );
}

export default App;
