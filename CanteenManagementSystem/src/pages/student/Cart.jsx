import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Topbar from "../../components/Topbar.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function CartPage() {
  const { items, total, changeQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <Topbar title="Your cart" subtitle="One step closer to a really good break." />
      <div className="page-content narrow-content">
        <Link to="/student/menu" className="back-link">
          <ArrowLeft size={16} /> Continue browsing
        </Link>
        <div className="checkout-layout">
          <section className="panel cart-panel">
            <div className="panel-heading">
              <div>
                <h2>Your selection</h2>
                <p>{items.reduce((sum, item) => sum + item.quantity, 0)} items in your bag</p>
              </div>
              {items.length > 0 && (
                <button type="button" className="subtle-button" onClick={clearCart}>
                  <Trash2 size={15} /> Clear
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <div className="empty-icon"><ShoppingBag size={26} /></div>
                <h3>Your cart is taking a break</h3>
                <p>Add a few campus favourites and they'll show up here.</p>
                <Link to="/student/menu" className="primary-button">
                  Explore menu <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <ShoppingBag size={21} aria-hidden="true" />
                    )}
                  </div>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>
                      {item.category}
                      {item.prepTime ? ` · ${item.prepTime}` : ""}
                    </span>
                    <b>₹{Number(item.price).toFixed(2)}</b>
                  </div>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          <aside className="panel summary-panel">
            <h3>Order summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>
            <div className="summary-line">
              <span>Pickup fee</span>
              <strong className="free-text">FREE</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>
            <div className="pickup-note">
              <span>⌁</span>
              <div>
                <strong>Quick pickup</strong>
                <p>We'll give you a token as soon as your order is placed.</p>
              </div>
            </div>
            <button
              type="button"
              disabled={!items.length}
              className="primary-button full-button"
              onClick={() => navigate("/student/checkout")}
            >
              Continue to checkout <ArrowRight size={17} />
            </button>
            <p className="secure-note">Pay at the canteen counter when you collect your order.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
