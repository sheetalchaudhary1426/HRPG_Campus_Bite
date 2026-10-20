import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { CartProvider } from "../context/CartContext.jsx";
export default function StudentLayout() {
  return <CartProvider><div className="app-shell"><Sidebar /><main className="main-area"><Outlet /></main></div></CartProvider>;
}