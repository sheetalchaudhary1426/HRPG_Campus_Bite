import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
export default function Topbar({ title, subtitle, onSearch }) {
  const { user } = useAuth();
  return <header className="topbar"><div className="mobile-brand">HRPG Campus Bite</div><div className="topbar-heading"><h1>{title}</h1><p>{subtitle}</p></div><div className="topbar-actions"><label className="top-search"><Search size={17} /><input aria-label="Search food" placeholder="Search anything..." onChange={e => onSearch?.(e.target.value)} /></label><button className="notification-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="topbar-avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div></div></header>;
}