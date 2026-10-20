import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import StudentLayout from "./layouts/StudentLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StudentDashboard from "./pages/student/Dashboard.jsx";
import MenuPage from "./pages/student/Menu.jsx";
import CartPage from "./pages/student/Cart.jsx";
import OrdersPage from "./pages/student/Orders.jsx";
import TokenPage from "./pages/student/Token.jsx";
import CheckoutPage from "./pages/student/Checkout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminMenu from "./pages/admin/MenuManagement.jsx";
import AdminOrders from "./pages/admin/OrdersManagement.jsx";
import NotFound from "./pages/NotFound.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={user ? <HomeRedirect /> : <Login />} />
      <Route path="/register" element={user ? <HomeRedirect /> : <Register />} />
      <Route path="/student" element={user?.role === "student" ? <StudentLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<StudentDashboard />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="token" element={<TokenPage />} />
      </Route>
      <Route path="/admin" element={user?.role === "admin" ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}