
import { useEffect, useState } from "react";
import {
  Check,
  Edit3,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import Topbar from "../../components/Topbar.jsx";
import { categories } from "../../data/mockData.js";
import { menuAPI } from "../../services/api.js";

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Snacks",
    price: "",
    description: "",
  });

  // Load menu items from the backend.
  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        setError("");

        const data = await menuAPI.getAll();

        // Supports an array or common wrapped API responses.
        const menuItems = Array.isArray(data)
          ? data
          : data.menuItems ?? data.items ?? data.menu ?? [];

        setItems(menuItems);
      } catch (err) {
        setError(err.message || "Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  async function addItem(event) {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);

      const newItem = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        description: form.description.trim(),
        available: true,
      };

      const data = await menuAPI.create(newItem);

      const savedItem = data.menuItem ?? data.item ?? data;

      // Use the server response so MongoDB's _id is retained.
      if (!savedItem._id && !savedItem.id) {
        throw new Error(
          "The item may have been saved, but the API did not return the created item."
        );
      }

      setItems((previous) => [...previous, savedItem]);

      setForm({
        name: "",
        category: "Snacks",
        price: "",
        description: "",
      });

      setShowForm(false);
      showNotice("Menu item added successfully.");
    } catch (err) {
      setError(err.message || "Failed to add menu item.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(item) {
    const id = item._id ?? item.id;

    if (!id) {
      setError("This menu item has no ID. Reload the menu and try again.");
      return;
    }

    setError("");

    try {
      const updated = await menuAPI.update(id, {
        available: !item.available,
      });

      const savedItem =
        updated.menuItem ?? updated.item ?? updated;

      setItems((previous) =>
        previous.map((current) =>
          (current._id ?? current.id) === id
            ? { ...current, ...savedItem }
            : current
        )
      );

      showNotice("Availability updated.");
    } catch (err) {
      setError(err.message || "Failed to update availability.");
    }
  }

  async function deleteItem(item) {
    const id = item._id ?? item.id;

    if (!id) {
      setError("This menu item has no ID. Reload the menu and try again.");
      return;
    }

    if (!window.confirm(`Delete "${item.name}" from the menu?`)) {
      return;
    }

    setError("");
    setDeletingItemId(id);

    try {
      await menuAPI.remove(id);
      setItems((previous) =>
        previous.filter((current) => (current._id ?? current.id) !== id)
      );
      showNotice("Menu item deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete menu item.");
    } finally {
      setDeletingItemId(null);
    }
  }

  const filtered = items.filter((item) =>
    item.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Topbar
        title="Manage menu"
        subtitle="Keep your menu fresh, accurate, and available."
      />

      <div className="page-content">
        {notice && <div className="toast-message">{notice}</div>}

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="admin-welcome">
          <div>
            <span className="eyebrow">MENU MANAGEMENT</span>
            <h2>What's on the menu?</h2>

            <p>
              {items.filter((item) => item.available).length} items available
              {" · "}
              {items.filter((item) => !item.available).length} unavailable
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm((value) => !value)}
          >
            <Plus size={17} />
            Add menu item
          </button>
        </div>

        {showForm && (
          <form className="panel add-menu-form" onSubmit={addItem}>
            <h3>Add a menu item</h3>

            <div className="form-grid">
              <label>
                Item name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Veg Pulao"
                />
              </label>

              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Price (₹)
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  placeholder="90"
                />
              </label>

              <label>
                Description
                <input
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="A short description"
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="subtle-button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                <Check size={16} />
                {saving ? "Saving..." : "Save item"}
              </button>
            </div>
          </form>
        )}

        <div className="menu-admin-toolbar">
          <label className="menu-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu items..."
            />
          </label>

          <span>{filtered.length} items</span>
        </div>

        <div className="panel admin-menu-list">
          {loading ? (
            <div className="empty-state">Loading menu items...</div>
          ) : (
            <>
              {filtered.map((item) => (
                <div
                  className="admin-menu-row"
                  key={item._id ?? item.id}
                >
                  <div className="admin-food-thumb">
                    <img
                      src={item.image || "/images/food-placeholder.jpg"}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.parentElement.classList.add(
                          "thumb-fallback"
                        );
                      }}
                    />
                  </div>

                  <div className="admin-food-info">
                    <strong>{item.name}</strong>
                    <span>
                      {item.category} · {item.description}
                    </span>
                  </div>

                  <strong className="admin-food-price">
                    ₹{item.price}
                  </strong>

                  <span
                    className={`availability-label ${
                      item.available
                        ? "is-available"
                        : "is-unavailable"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>

                  <button
                    type="button"
                    className="availability-button"
                    disabled={deletingItemId === (item._id ?? item.id)}
                    onClick={() => toggleAvailability(item)}
                    title="Toggle availability"
                    aria-label={`Mark ${item.name} ${
                      item.available ? "unavailable" : "available"
                    }`}
                  >
                    {item.available ? (
                      <ToggleRight size={27} />
                    ) : (
                      <ToggleLeft size={27} />
                    )}
                  </button>
                  <button
                    type="button"
                    className="delete-menu-button"
                    disabled={deletingItemId === (item._id ?? item.id)}
                    onClick={() => deleteItem(item)}
                    aria-label={`Delete ${item.name}`}
                    title="Delete menu item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="empty-state">
                  No matching menu items.
                </div>
              )}
            </>
          )}
        </div>

        <p className="admin-footnote">
          <Edit3 size={14} />
          Menu changes are saved through the backend.
        </p>
      </div>
    </>
  );
}

export default MenuManagement;
