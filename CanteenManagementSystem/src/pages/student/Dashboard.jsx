import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, ShoppingBag, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import Topbar from "../../components/Topbar.jsx";
import FoodCard from "../../components/FoodCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { menuAPI, orderAPI } from "../../services/api.js";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { addItem, count } = useCart();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [menu, userOrders] = await Promise.all([
          menuAPI.getAll({ available: true }),
          orderAPI.getMyOrders(),
        ]);
        if (active) {
          setError("");
          setItems(Array.isArray(menu) ? menu : []);
          setOrders(Array.isArray(userOrders) ? userOrders : []);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load your campus dashboard.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [refreshCount]);

  const latestOrder = orders[0];

  return (
    <>
      <Topbar
        title="Your dashboard"
        subtitle="A little something good is never far away."
      />
      <div className="page-content">
        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="eyebrow light-eyebrow">YOUR CAMPUS, YOUR TABLE</span>
            <h2>
              Good food, {user?.name?.split(" ")[0] || "right on time"}.
            </h2>
            <p>Order ahead and make more of your break.</p>
            <Link to="/student/menu" className="banner-button">
              Browse the menu <ArrowRight size={16} />
            </Link>
          </div>
          <div className="banner-art" aria-hidden="true">
            <img src={heroImage} alt="" />
            <div className="banner-art-caption">
              <span>FRESH FROM THE KITCHEN</span>
              <strong>Made for your break</strong>
            </div>
          </div>
          <span className="banner-decor" />
          <span className="banner-decor decor-two" />
        </section>

        {error && (
          <div className="error-message" role="alert">
            {error}{" "}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setLoading(true);
                setRefreshCount((current) => current + 1);
              }}
            >
              Try again
            </button>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon mint"><Utensils size={19} /></div>
            <div>
              <span className="stat-label">Available today</span>
              <strong className="stat-value">{loading ? "—" : items.length}</strong>
              <span className="stat-note">menu favourites</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon peach"><ClipboardList size={19} /></div>
            <div>
              <span className="stat-label">Your orders</span>
              <strong className="stat-value">{loading ? "—" : orders.length}</strong>
              <span className="stat-note">placed with HRPG Campus Bite</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon lavender"><ShoppingBag size={19} /></div>
            <div>
              <span className="stat-label">In your cart</span>
              <strong className="stat-value">{count}</strong>
              <span className="stat-note">items ready to check out</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow"><ClipboardList size={19} /></div>
            <div>
              <span className="stat-label">Latest order</span>
              <strong className="stat-value">
                {latestOrder ? `#${latestOrder.tokenNumber}` : "—"}
              </strong>
              <span className="stat-note">
                {latestOrder?.status || "No orders yet"}
              </span>
            </div>
          </div>
        </div>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT'S COOKING</span>
              <h2>Available right now</h2>
              <p>Pick a favourite and we'll have it ready for pickup.</p>
            </div>
            <Link to="/student/menu" className="text-link">
              See full menu <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="empty-state" role="status">Loading the menu...</div>
          ) : items.length ? (
            <div className="food-grid">
              {items.slice(0, 4).map((item) => (
                <FoodCard
                  key={item._id ?? item.id}
                  item={{ ...item, available: item.available !== false }}
                  onAdd={addItem}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {error
                ? "The menu is temporarily unavailable."
                : "No menu items are available right now. Please check back soon."}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
