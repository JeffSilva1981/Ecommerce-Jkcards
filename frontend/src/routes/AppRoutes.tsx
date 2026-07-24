import {
  Route,
  Routes,
} from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { StoreLayout } from "../layouts/StoreLayout";
import { CardFormPage } from "../pages/admin/CardFormPage";
import { CardsAdminPage } from "../pages/admin/CardsAdminPage";
import { CategoriesAdminPage } from "../pages/admin/CategoriesAdminPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { OrdersAdminPage } from "../pages/admin/OrdersAdminPage";
import { ProductFormPage } from "../pages/admin/ProductFormPage";
import { ProductsAdminPage } from "../pages/admin/ProductsAdminPage";
import { UsersAdminPage } from "../pages/admin/UsersAdminPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { AboutPage } from "../pages/institutional/AboutPage";
import { ContactPage } from "../pages/institutional/ContactPage";
import { FaqPage } from "../pages/institutional/FaqPage";
import { PaymentMethodsPage } from "../pages/institutional/PaymentMethodsPage";
import { PrivacyPolicyPage } from "../pages/institutional/PrivacyPolicyPage";
import { ReturnsPolicyPage } from "../pages/institutional/ReturnsPolicyPage";
import { SalesPolicyPage } from "../pages/institutional/SalesPolicyPage";
import { ShippingPage } from "../pages/institutional/ShippingPage";
import { TermsOfUsePage } from "../pages/institutional/TermsOfUsePage";
import { CartPage } from "../pages/store/CartPage";
import { CheckoutPage } from "../pages/store/CheckoutPage";
import { HomePage } from "../pages/store/HomePage";
import { MyOrdersPage } from "../pages/store/MyOrdersPage";
import { NotFoundPage } from "../pages/store/NotFoundPage";
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

        <Route
          path="esqueci-senha"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="redefinir-senha"
          element={<ResetPasswordPage />}
        />

        <Route
          path="sobre"
          element={<AboutPage />}
        />

        <Route
          path="politica-de-vendas"
          element={<SalesPolicyPage />}
        />

        <Route
          path="trocas-e-devolucoes"
          element={<ReturnsPolicyPage />}
        />

        <Route
          path="privacidade"
          element={<PrivacyPolicyPage />}
        />

        <Route
          path="termos-de-uso"
          element={<TermsOfUsePage />}
        />

        <Route
          path="envios"
          element={<ShippingPage />}
        />

        <Route
          path="pagamentos"
          element={<PaymentMethodsPage />}
        />

        <Route
          path="duvidas-frequentes"
          element={<FaqPage />}
        />

        <Route
          path="contato"
          element={<ContactPage />}
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

        <Route
          path="*"
          element={<NotFoundPage />}
        />
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
    </Routes>
  );
}