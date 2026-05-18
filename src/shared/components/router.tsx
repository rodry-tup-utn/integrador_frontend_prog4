import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { LandingPage } from "../../pages/LandingPage";
import { AdminRoute } from "./AdminRoute";
import { IngredientsPage } from "../../features/ingredients/pages/IngredientsPage";
import ProductsPage from "../../pages/Products/ProductsPage";
import RegisterPage from "../../pages/Register/RegisterPage";
import { IngredientsPublicPage } from "../../features/ingredients/pages/PublicIngredientsPage";
import CategoriesAdminPage from "../../features/categories/pages/CategoriesAdminPage";
import { ForbiddenPage } from "../../pages/ForbiddenPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.LANDING,
        element: <LandingPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.PUBLIC_INGREDIENTS,
        element: <IngredientsPublicPage />,
      },
      { path: ROUTES.PUBLIC_PRODUCTS, element: <h1>Nuestros Productos </h1> },
      {
        path: ROUTES.FORBIDDEN,
        element: <ForbiddenPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.HOME,
            element: <DashboardPage />,
          },
          { path: "/", element: <Navigate to={ROUTES.HOME} replace /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: ROUTES.ADMIN_INGREDIENTS,
            element: <IngredientsPage />,
          },
          {
            path: ROUTES.ADMIN_PRODUCTS,
            element: <ProductsPage />,
          },
          {
            path: ROUTES.ADMIN_CATEGORIES,
            element: <CategoriesAdminPage />,
          },
        ],
      },
    ],
  },
]);
