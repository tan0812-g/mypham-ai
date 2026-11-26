import { Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import AdminReportsPage from "./pages/AdminReportsPage.jsx";
import AdminReviewsPage from "./pages/AdminReviewsPage.jsx";
import AdminCustomersPage from "./pages/AdminCustomersPage.jsx";
import AdminKnowledgePage from "./pages/AdminKnowledgePage.jsx";
import AdminStaffPage from "./pages/AdminStaffPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminSupportPage from "./pages/AdminSupportPage.jsx";
import AdminCouponsPage from "./pages/AdminCouponsPage.jsx";
import AdminCategoriesPage from "./pages/AdminCategoriesPage.jsx";
import AdminProductImagePage from "./pages/AdminProductImagePage.jsx";
import AiAdvisorPage from "./pages/AiAdvisorPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductCatalogPage from "./pages/ProductCatalogPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import "./App.css";

function App() {
  return <Routes><Route path="/" element={<HomePage />} /><Route path="/san-pham" element={<ProductCatalogPage />} /><Route path="/san-pham/:id" element={<ProductPage />} /><Route path="/gio-hang" element={<CartPage />} /><Route path="/thanh-toan" element={<CheckoutPage />} /><Route path="/ai-tu-van" element={<AiAdvisorPage />} /><Route path="/admin/login" element={<AdminLoginPage />} /><Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} /><Route path="/admin/san-pham" element={<AdminGuard><AdminProductsPage /></AdminGuard>} /><Route path="/admin/san-pham/:id/anh" element={<AdminGuard><AdminProductImagePage /></AdminGuard>} /><Route path="/admin/don-hang" element={<AdminGuard><AdminOrdersPage /></AdminGuard>} /><Route path="/admin/bao-cao" element={<AdminGuard><AdminReportsPage /></AdminGuard>} /><Route path="/admin/danh-gia" element={<AdminGuard><AdminReviewsPage /></AdminGuard>} /><Route path="/admin/khach-hang" element={<AdminGuard><AdminCustomersPage /></AdminGuard>} /><Route path="/admin/kien-thuc-ai" element={<AdminGuard><AdminKnowledgePage /></AdminGuard>} /><Route path="/admin/nhan-vien" element={<AdminGuard><AdminStaffPage /></AdminGuard>} /><Route path="/admin/ho-tro" element={<AdminGuard><AdminSupportPage /></AdminGuard>} /><Route path="/admin/ma-giam-gia" element={<AdminGuard><AdminCouponsPage /></AdminGuard>} /><Route path="/admin/danh-muc" element={<AdminGuard><AdminCategoriesPage /></AdminGuard>} /><Route path="/tai-khoan" element={<AccountPage />} /><Route path="/tai-khoan/doi-mat-khau" element={<ChangePasswordPage />} /><Route path="/don-hang/:code" element={<OrderDetailPage />} /><Route path="/ho-tro" element={<SupportPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}

function AdminGuard({ children }) {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("mpai_admin_user") || "null"); } catch { localStorage.removeItem("mpai_admin_user"); }
  const token = localStorage.getItem("mpai_admin_token");
  return token && user?.role === "QUAN_TRI" ? children : <Navigate to="/admin/login" replace />;
}

export default App;
