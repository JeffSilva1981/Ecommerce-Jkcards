import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { StoreLayout } from "../layouts/StoreLayout";
import { CardsAdminPage } from "../pages/admin/CardsAdminPage";
import { CategoriesAdminPage } from "../pages/admin/CategoriesAdminPage";
import { CardFormPage } from "../pages/admin/CardFormPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { OrdersAdminPage } from "../pages/admin/OrdersAdminPage";
import { ProductFormPage } from "../pages/admin/ProductFormPage";
import { ProductsAdminPage } from "../pages/admin/ProductsAdminPage";
import { UsersAdminPage } from "../pages/admin/UsersAdminPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { CartPage } from "../pages/store/CartPage";
import { CheckoutPage } from "../pages/store/CheckoutPage";
import { HomePage } from "../pages/store/HomePage";
import { MyOrdersPage } from "../pages/store/MyOrdersPage";
import { OrderDetailsPage } from "../pages/store/OrderDetailsPage";
import { ProductDetailsPage } from "../pages/store/ProductDetailsPage";
import { ProductsPage } from "../pages/store/ProductsPage";
import { ProfilePage } from "../pages/store/ProfilePage";
import { AdminRoute } from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route
          index
          element={<HomePage />}
        />

        <Route
          path="produtos"
          element={<ProductsPage />}
        />

        <Route
          path="produtos/:id"
          element={<ProductDetailsPage />}
        />

        <Route
          path="carrinho"
          element={<CartPage />}
        />

        <Route
          path="login"
          element={<LoginPage />}
        />

        <Route
          path="cadastro"
          element={<RegisterPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="perfil"
            element={<ProfilePage />}
          />

          <Route
            path="checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="pedidos"
            element={<MyOrdersPage />}
          />

          <Route
            path="pedidos/:id"
            element={<OrderDetailsPage />}
          />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route
          path="admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="produtos"
            element={<ProductsAdminPage />}
          />

          <Route
            path="produtos/:id"
            element={<ProductFormPage />}
          />

          <Route
            path="cartas"
            element={<CardsAdminPage />}
          />

          <Route
            path="cartas/nova"
            element={<CardFormPage />}
          />

          <Route
            path="categorias"
            element={<CategoriesAdminPage />}
          />

          <Route
            path="pedidos"
            element={<OrdersAdminPage />}
          />

          <Route
            path="usuarios"
            element={<UsersAdminPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}