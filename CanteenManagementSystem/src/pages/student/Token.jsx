import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, Copy, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { orderAPI } from "../../services/api.js";

function getSavedOrder() {
  const savedOrder = localStorage.getItem("canteen_latest_order");
  if (!savedOrder) return null;

  try {
    return JSON.parse(savedOrder);
  } catch {
    localStorage.removeItem("canteen_latest_order");
    return null;
  }
}

export default function TokenPage() {
  const [order, setOrder] = useState(getSavedOrder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadLatestOrder() {
      try {
        const orders = await orderAPI.getMyOrders();
        if (!Array.isArray(orders)) {
          throw new Error("Unexpected orders response from the server.");
        }

        const saved = getSavedOrder();
        const currentOrder =
          orders.find((item) => item._id === saved?._id) ?? orders[0] ?? null;

        if (active) {
          setOrder(currentOrder);
          if (currentOrder) {
            localStorage.setItem(
              "canteen_latest_order",
              JSON.stringify(currentOrder)
            );
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to refresh your pickup token.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLatestOrder();
    return () => {
      active = false;
    };
  }, []);

  async function copyToken() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(String(order.tokenNumber));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the token. Please note it down manually.");
    }
  }

  const isReady = ["ready", "completed"].includes(order?.status);

  return (
    <>
      <Topbar title="Pickup token" subtitle="Your shortcut to a quicker lunch break." />
      <div className="page-content token-page-content">
        {error && <p className="error-message" role="alert">{error}</p>}
        {loading && !order ? (
          <div className="empty-state" role="status">Loading your pickup token...</div>
        ) : !order ? (
          <div className="empty-state panel">
            <TicketCheck size={27} />
            <h2>No active pickup token</h2>
            <p>Place an order to receive a token for the pickup counter.</p>
            <Link to="/student/menu" className="primary-button">
              Explore menu <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="token-page-heading">
              <span className="eyebrow">YOUR ORDER, YOUR TOKEN</span>
              <h2>You're one step closer.</h2>
              <p>Keep this screen handy when you reach the pickup counter.</p>
            </div>
            <div className="token-ticket">
              <div className="ticket-top">
                <div className="ticket-brand">
                  <span className="brand-mark"><TicketCheck size={18} /></span>
                  <div><strong>HRPG Campus Bite</strong><span>PICKUP PASS</span></div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="ticket-dashed" />
              <div className="ticket-center">
                <span>YOUR PICKUP TOKEN</span>
                <strong>{order.tokenNumber}</strong>
                <p>Show this number to our canteen team</p>
                <button
                  type="button"
                  className="copy-token-button"
                  onClick={copyToken}
                >
                  <Copy size={15} /> {copied ? "Copied" : "Copy token"}
                </button>
              </div>
              <div className="ticket-dashed" />
              <div className="ticket-bottom">
                <div><span>ORDER ID</span><strong>{order._id}</strong></div>
                <div>
                  <span>ESTIMATED WAIT</span>
                  <strong><Clock3 size={15} /> {isReady ? "Ready now" : "10–15 min"}</strong>
                </div>
              </div>
            </div>
            <div className="token-steps panel">
              <div className="token-step done">
                <span><Check size={16} /></span>
                <div><strong>Order placed</strong><p>Your order has been received by the kitchen.</p></div>
              </div>
              <div className={`token-step ${isReady ? "done" : order.status === "preparing" ? "current" : ""}`}>
                <span>{isReady ? <Check size={16} /> : "2"}</span>
                <div><strong>Preparing your food</strong><p>Our team is putting your order together.</p></div>
              </div>
              <div className={`token-step ${isReady ? "current" : ""}`}>
                <span>3</span>
                <div><strong>Collect at the counter</strong><p>Show token {order.tokenNumber} and enjoy your  meal.</p></div>
              </div>
            </div>
            <Link to="/student/orders" className="text-link token-orders-link">
              View all orders <ArrowRight size={16} />
            </Link>
          </>
        )}
      </div>
    </>
  );
}
