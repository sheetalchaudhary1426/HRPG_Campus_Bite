import { UtensilsCrossed } from "lucide-react";
export default function Brand({ compact = false }) {
  return <div className={`brand ${compact ? "brand-compact" : ""}`}><span className="brand-mark"><UtensilsCrossed size={19} /></span><span><strong>HRPG Campus Bite</strong>{!compact && <small>GOOD FOOD. ZERO QUEUES.</small>}</span></div>;
}