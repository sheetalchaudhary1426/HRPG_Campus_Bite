import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { orderAPI } from "../../services/api.js";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function placeOrder() {
    if (!items.length) {
      setError("Your cart is empty. Add an item before placing an order.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const order = await orderAPI.create({
        items: items.map(({ id, quantity }) => ({
          menuItem: id,
          quantity,
        })),
      });

      if (!order?._id || order.tokenNumber == null) {
        throw new Error("The API did not return a valid pickup token.");
      }

      localStorage.setItem("canteen_latest_order", JSON.stringify(order));
      clearCart();
      navigate("/student/token", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to place your order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Topbar
        title="Confirm your order"
        subtitle="Review your items before sending them to the kitchen."
      />
      <div className="page-content narrow-content">
        <Link to="/student/cart" className="back-link">
          <ArrowLeft size={16} /> Back to cart
        </Link>
        <section className="panel checkout-confirmation">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">PICKUP ORDER</span>
              <h2>Your order</h2>
              <p>Your pickup token will be created when the order is accepted.</p>
            </div>
            <CheckCircle2 size={24} />
          </div>

          {error && <p className="error-message" role="alert">{error}</p>}

          {items.length ? (
            <>
              <div className="checkout-order-items">
                {items.map((item) => (
                  <div className="summary-line" key={item.id}>
                    <span>{item.name} × {item.quantity}</span>
                    <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
              <p className="secure-note">
                No online payment is collected. Pay at the canteen counter.
              </p>
            </>
          ) : (
            <div className="empty-state">
              Your cart is empty. Add menu items before checkout.
              <Link to="/student/menu" className="text-link">
                Browse the menu
              </Link>
            </div>
          )}

          <button
            type="button"
            className="primary-button full-button"
            disabled={submitting || !items.length}
            onClick={placeOrder}
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </section>
      </div>
    </>
  );
}
