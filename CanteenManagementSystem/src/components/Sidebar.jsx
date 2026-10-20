import { NavLink } from "react-router-dom";
import { LayoutDashboard, Utensils, ShoppingBag, Ticket, LogOut, ClipboardList, ChefHat } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "./Brand.jsx";

export default function Sidebar({ mode = "student" }) {
  const { user, logout } = useAuth();
  const isAdmin = mode === "admin";
  const links = isAdmin
    ? [{ to: "/admin", label: "Overview", icon: LayoutDashboard, end: true }, { to: "/admin/orders", label: "Order queue", icon: ClipboardList }, { to: "/admin/menu", label: "Manage menu", icon: Utensils }]
    : [{ to: "/student", label: "Overview", icon: LayoutDashboard, end: true }, { to: "/student/menu", label: "Explore menu", icon: Utensils }, { to: "/student/cart", label: "My cart", icon: ShoppingBag }, { to: "/student/orders", label: "My orders", icon: ClipboardList }, { to: "/student/token", label: "Pickup token", icon: Ticket }];
  return <aside className="sidebar">
    <Brand />
    <div className="sidebar-label">{isAdmin ? "CANTEEN MANAGEMENT" : "YOUR CAMPUS"}</div>
    <nav className="side-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-bottom">
      <div className="help-card"><div className="help-icon"><ChefHat size={18} /></div><strong>{isAdmin ? "Kitchen is live" : "Hungry for more?"}</strong><p>{isAdmin ? "Keep orders moving and pickup times short." : "Fresh food, ready when you are."}</p></div>
      <div className="user-mini"><div className="avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div><div className="user-mini-copy"><strong>{user?.name || "Campus user"}</strong><span>{isAdmin ? "Canteen admin" : "Student account"}</span></div><button type="button" className="icon-button" title="Sign out" onClick={logout}><LogOut size={17} /></button></div>
    </div>
  </aside>;
}