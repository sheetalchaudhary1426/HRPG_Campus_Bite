import { Clock3, Plus, Star } from "lucide-react";

export default function FoodCard({ item, onAdd }) {
  const imageClass = `food-image-wrap${item.image ? "" : " image-fallback"}`;

  return (
    <article className={`food-card${item.available ? "" : " food-unavailable"}`}>
      <div className={imageClass}>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement.classList.add("image-fallback");
            }}
          />
        )}
        <span className="food-category">{item.category}</span>
        {item.popular && <span className="popular-tag">POPULAR</span>}
      </div>
      <div className="food-info">
        <div className="food-title-row">
          <h3>{item.name}</h3>
          {item.rating != null && (
            <span className="food-rating">
              <Star size={13} fill="currentColor" /> {item.rating}
            </span>
          )}
        </div>
        <p>{item.description}</p>
        <div className="food-card-bottom">
          <div>
            <strong className="food-price">
              ₹{Number(item.price).toFixed(2)}
            </strong>
            {item.prepTime && (
              <span className="prep-time">
                <Clock3 size={13} /> {item.prepTime}
              </span>
            )}
          </div>
          <button
            disabled={!item.available}
            className="add-button"
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.name}`}
          >
            <Plus size={18} />
          </button>
        </div>
        {!item.available && (
          <span className="sold-out">Currently unavailable</span>
        )}
      </div>
    </article>
  );
}
