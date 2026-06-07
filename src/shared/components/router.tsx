import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { LandingPage } from "../../pages/LandingPage";
import { IngredientsAdminPage } from "../../features/ingredients/pages/IngredientsAdminPage";
import { IngredientsPublicPage } from "../../features/ingredients/pages/IngredientsPublicPage";
import CategoriesAdminPage from "../../features/categories/pages/CategoriesAdminPage";
import { ForbiddenPage } from "../../pages/ForbiddenPage";
import UserAdminPage from "../../features/user/pages/UserAdminPage";
import { ProfilePage } from "../../features/user/pages/ProfilePage";
import { ChangePasswordPage } from "../../features/user/pages/ChangePasswordPage";
import { MyOrdersPage } from "../../features/orders/pages/MyOrdersPage";
import { AdminOrdersPage } from "../../features/orders/pages/AdminOrdersPage";
import { KitchenPage } from "../../features/orders/pages/KitchenPage";
import { RoleRoute } from "./RoleRoute";
import ProductsAdminPage from "../../features/products/pages/ProductsAdminPage";
import ProductsAdminDetail from "../../features/products/pages/ProductsAdminDetail";
import { UnderConstructionPage } from "../../pages/UnderConstructionPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

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
          {
            path: ROUTES.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: ROUTES.CHANGE_PASSWORD,
            element: <ChangePasswordPage />,
          },
          {
            path: ROUTES.MY_ORDERS,
            element: <MyOrdersPage />,
          },
          { path: "/", element: <Navigate to={ROUTES.HOME} replace /> },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["ADMIN", "STOCK"]} />,
        children: [
          {
            path: ROUTES.STOCK_INGREDIENTS,
            element: <IngredientsAdminPage />,
          },
          { path: ROUTES.STOCK_PRODUCTS, element: <ProductsAdminPage /> },
          {
            path: ROUTES.STOCK_PRODUCTS_DETAIL,
            element: <ProductsAdminDetail />,
          },
        ],
      },
      {
        element: (
          <RoleRoute
            allowedRoles={["ADMIN"]}
            errorMessage="Debes ser Administrador para acceder a esta sección"
          />
        ),
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

          { path: ROUTES.ADMIN_USERS, element: <UserAdminPage /> },
          { path: ROUTES.ADMIN_METRICS, element: <UnderConstructionPage /> },
          { path: ROUTES.ADMIN_CONFIG, element: <UnderConstructionPage /> },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["ADMIN", "ORDERS"]} />,
        children: [
          { path: ROUTES.ORDERS_ADMIN, element: <AdminOrdersPage /> },
          { path: ROUTES.KITCHEN_BOARD, element: <KitchenPage /> },
        ],
      },
    ],
  },
]);
