import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { ProtectedRoute } from "./modules/auth/components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Aquí irán luego Productos, Categorías, etc. */}
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
