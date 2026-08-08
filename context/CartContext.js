"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

// NOTE: Cart is kept in React state only (no localStorage per artifact rules),
// but in your real deployed app (outside claude.ai) you can safely persist
// this to localStorage for a better guest experience across page reloads.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product, quantity = 1, selectedVariant = {}) => {
    setItems((prev) => {
      const key = product._id + JSON.stringify(selectedVariant);
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product._id,
          name: product.name,
          image: product.images?.[0],
          price: product.discountPrice || product.price,
          quantity,
          selectedVariant,
        },
      ];
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };

  const removeFromCart = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
