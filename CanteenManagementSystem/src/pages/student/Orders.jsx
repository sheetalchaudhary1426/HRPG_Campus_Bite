import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { orderAPI } from "../../services/api.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await orderAPI.getMyOrders();
        if (!Array.isArray(response)) {
          throw new Error("Unexpected orders response from the server.");
        }
        if (active) {
          setError("");
          setOrders(response);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load your orders.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, [refreshCount]);

  return (
    <>
      <Topbar title="My orders" subtitle="Track your latest canteen orders." />
      <div className="page-content narrow-content">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ORDER HISTORY</span>
            <h2>Your orders</h2>
            <p>Order and pickup status updates from the canteen.</p>
          </div>
          <button
            type="button"
            className="subtle-button"
            onClick={() => {
              setLoading(true);
              setRefreshCount((current) => current + 1);
            }}
          >
            Refresh
          </button>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}
        {loading ? (
          <div className="empty-state" role="status">Loading your orders...</div>
        ) : orders.length ? (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="panel order-card" key={order._id}>
                <div className="order-card-heading">
                  <div>
                    <span className="eyebrow">PICKUP TOKEN</span>
                    <h3>#{order.tokenNumber}</h3>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="order-card-items">
                  {order.items.map((item, index) => (
                    <p key={`${order._id}-${index}`}>
                      {item.name} <span>× {item.quantity}</span>
                    </p>
                  ))}
                </div>
                <div className="order-card-footer">
                  <span>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Recently placed"}
                  </span>
                  <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state panel">
            <ClipboardList size={25} />
            <p>You haven't placed an order yet.</p>
            <Link to="/student/menu" className="text-link">
              Explore the menu <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
