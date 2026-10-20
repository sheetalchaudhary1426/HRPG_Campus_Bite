export default function StatusBadge({ status }) {
  const labels = {
    pending: "Placed",
    preparing: "Preparing",
    ready: "Ready for pickup",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  const label = labels[status] ?? status;
  const key = label.toLowerCase().replaceAll(" ", "-");

  return <span className={`status-badge status-${key}`}>{label}</span>;
}