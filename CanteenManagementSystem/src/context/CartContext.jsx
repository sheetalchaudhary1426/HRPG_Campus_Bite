import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    const id = product._id ?? product.id;

    if (!id || !product.available) {
      throw new Error("This menu item cannot be added to your cart.");
    }

    setItems((current) => {
      const existing = current.find((item) => item.id === id);

      if (existing) {
        return current.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + 1, 50) }
            : item
        );
      }

      return [...current, { ...product, id, quantity: 1 }];
    });
  }, []);

  const changeQuantity = useCallback((id, delta) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + delta, 50) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const value = useMemo(
    () => ({ items, count, total, addItem, changeQuantity, clearCart }),
    [items, count, total, addItem, changeQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
