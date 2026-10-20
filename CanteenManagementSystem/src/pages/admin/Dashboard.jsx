
import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalMenuItems: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError("");

        const data = await adminAPI.getStats();

        // Supports either a direct object or { stats: {...} }.
        const result = data.stats ?? data;

        setStats((previous) => ({
          ...previous,
          ...result,
        }));
      } catch (err) {
        setError(err.message || "Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <p role="alert">Error loading dashboard: {error}</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Menu Items</h3>
          <p>{stats.totalMenuItems}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
