import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
export default function AdminLayout() {
  return <div className="app-shell"><Sidebar mode="admin" /><main className="main-area"><Outlet /></main></div>;
}