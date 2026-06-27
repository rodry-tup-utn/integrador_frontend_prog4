import { createBrowserRouter } from "react-router-dom";
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
import ProductsPage from "../../pages/Products/ProductsPage";
import { MetricsPage } from "../../features/estadisticas/pages/MetricsPage";
import { UnderConstructionPage } from "../../pages/UnderConstructionPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import CheckoutPage from "../../features/cart/pages/CheckoutPage";
import PaymentSuccess from "../../features/payment/pages/PaymentSuccess";
import PaymentFailure from "../../features/payment/pages/PaymentFailure";
import PaymentPending from "../../features/payment/pages/PaymentPending";

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
      { path: ROUTES.PUBLIC_PRODUCTS, element: <ProductsPage /> },
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
        ],
      },
      {
        element: (
          <RoleRoute
            allowedRoles={["CLIENT", "ADMIN"]}
            errorMessage="Debes ser cliente para realizar pedidos"
          />
        ),
        children: [
          { path: ROUTES.CHECKOUT, element: <CheckoutPage /> },
          { path: ROUTES.CHECKOUT_SUCCESS, element: <PaymentSuccess /> },
          { path: ROUTES.CHECKOUT_FAILURE, element: <PaymentFailure /> },
          { path: ROUTES.CHECKOUT_PENDING, element: <PaymentPending /> },
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
          { path: ROUTES.ADMIN_METRICS, element: <MetricsPage /> },
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
