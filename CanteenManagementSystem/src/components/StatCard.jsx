export default function StatCard({ icon: Icon, label, value, note, tone = "green" }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-note">{note}</span></div></div>;
}