import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar.jsx";
import FoodCard from "../../components/FoodCard.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { categories } from "../../data/mockData.js";
import { menuAPI } from "../../services/api.js";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { addItem, count } = useCart();

  useEffect(() => {
    let active = true;

    async function loadMenu() {
      try {
        const data = await menuAPI.getAll({ available: true });
        if (active) {
          setItems(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load the menu.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMenu();
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;
      const matchesSearch =
        !search ||
        `${item.name} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [items, category, query]);

  function addToCart(item) {
    addItem(item);
    setNotice(`${item.name} added to your cart.`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  return (
    <>
      <Topbar
        title="Explore the menu"
        subtitle="Fresh campus favourites, ready when you are."
        onSearch={setQuery}
      />
      <div className="page-content">
        <div className="menu-intro">
          <div>
            <span className="eyebrow">MADE FRESH ON CAMPUS</span>
            <h2>Find your next favourite.</h2>
            <p>Choose an item and add it to your bag to order ahead.</p>
          </div>
          <Link to="/student/cart" className="canteen-open" aria-live="polite">
            <ShoppingBag size={17} />
            {count} {count === 1 ? "item" : "items"} in your cart
            <ArrowRight size={15} />
          </Link>
        </div>

        {notice && (
          <div className="toast-message" role="status">
            {notice}
          </div>
        )}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="category-tabs" aria-label="Filter by category">
          {categories.map((itemCategory) => (
            <button
              key={itemCategory}
              type="button"
              className={`category-tab${category === itemCategory ? " active" : ""}`}
              aria-pressed={category === itemCategory}
              onClick={() => setCategory(itemCategory)}
            >
              {itemCategory}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state" role="status">
            Loading the menu...
          </div>
        ) : filteredItems.length ? (
          <>
            <div className="menu-results-heading">
              Showing <strong>{filteredItems.length}</strong> available items
            </div>
            <div className="food-grid menu-food-grid">
            {filteredItems.map((item) => (
              <FoodCard
                key={item._id ?? item.id}
                item={{ ...item, available: item.available !== false }}
                onAdd={addToCart}
              />
            ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            {error
              ? "The menu is temporarily unavailable."
              : items.length
              ? "No available items match your search."
              : "The menu is empty right now. Please check back soon."}
          </div>
        )}
      </div>
    </>
  );
}
