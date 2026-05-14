import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { AdminRoute } from "./AdminRoute";
import { IngredientsPage } from "../../features/ingredients/pages/IngredientsPage";
import ProductsPage from "../../pages/Products/ProductsPage";
import CategoriesPage from "../../pages/Categories/CategoriesPage";
import RegisterPage from "../../pages/Register/RegisterPage";
import { IngredientsPublicPage } from "../../features/ingredients/pages/PublicIngredientsPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.HOME,
            element: <DashboardPage />,
          },
          {
            path: ROUTES.PUBLIC_INGREDIENTS,
            element: <IngredientsPublicPage />,
          },
          { path: "/", element: <DashboardPage /> },
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
            element: <CategoriesPage />,
          },
        ],
      },
    ],
  },
]);
