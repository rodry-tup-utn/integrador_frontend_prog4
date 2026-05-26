import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { LandingPage } from "../../pages/LandingPage";
import { AdminRoute } from "./AdminRoute";
import { IngredientsAdminPage } from "../../features/ingredients/pages/IngredientsAdminPage";
import RegisterPage from "../../pages/Register/RegisterPage";
import { IngredientsPublicPage } from "../../features/ingredients/pages/IngredientsPublicPage";
import CategoriesAdminPage from "../../features/categories/pages/CategoriesAdminPage";
import { ForbiddenPage } from "../../pages/ForbiddenPage";
import UserAdminPage from "../../features/user/pages/UserAdminPage";
import ProductsAdminPage from "../../features/products/pages/ProductsAdminPage";
import ProductsAdminDetail from "../../features/products/pages/ProductsAdminDetail";

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
            element: <IngredientsAdminPage />,
          },
          {
            path: ROUTES.ADMIN_PRODUCTS,
            element: <ProductsAdminPage />,
          },
          {
            path: ROUTES.ADMIN_CATEGORIES,
            element: <CategoriesAdminPage />,
          },
          {
            path: ROUTES.ADMIN_PRODUCTS_DETAIL,
            element: <ProductsAdminDetail />
          },
          { path: ROUTES.ADMIN_USERS, element: <UserAdminPage /> },
        ],
      },
    ],
  },
]);
