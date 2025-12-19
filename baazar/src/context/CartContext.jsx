// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Load cart from localStorage on first render (persistent cart)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("baazar_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to parse saved cart:", err);
      return [];
    }
  });

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("baazar_cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cartItems]);

  // Normalize price: "₹79,999" → 79999
  const normalizePrice = (price) => {
    if (price === null || price === undefined) return 0;
    if (typeof price === "number") return price;
    const sanitized = price.toString().replace(/[^0-9]/g, "");
    return sanitized ? Number(sanitized) : 0;
  };

  // ✅ Add item to cart (stable id + numeric price)
  const addToCart = (item) => {
    const normalizedItem = {
      ...item,
      id: item.id || item._id || String(Date.now()),
      price: normalizePrice(item.price ?? item.priceDisplay),
    };

    setCartItems((prev) => [...prev, normalizedItem]);
  };

  // ✅ Remove item by id
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Clear cart (also clears localStorage)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("baazar_cart");
  };

  // ✅ Total amount in rupees
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
