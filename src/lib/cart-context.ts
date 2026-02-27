"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        i => i.slug === action.item.slug && i.size === action.item.size
      );
      if (existing) {
        return state.map(i =>
          i.slug === action.item.slug && i.size === action.item.size
            ? { ...i, qty: i.qty + (action.item.qty || 1) }
            : i
        );
      }
      return [...state, { ...action.item, qty: action.item.qty || 1 }];
    }
    case "REMOVE":
      return state.filter(i => !(i.slug === action.slug && i.size === action.size));
    case "UPDATE_QTY":
      return state.map(i =>
        i.slug === action.slug && i.size === action.size
          ? { ...i, qty: Math.max(1, action.qty) }
          : i
      );
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aa_cart");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem("aa_cart", JSON.stringify(items));
  }, [items]);

  const addToCart   = (item) => dispatch({ type: "ADD", item });
  const removeItem  = (slug, size) => dispatch({ type: "REMOVE", slug, size });
  const updateQty   = (slug, size, qty) => dispatch({ type: "UPDATE_QTY", slug, size, qty });
  const clearCart   = () => dispatch({ type: "CLEAR" });

  const totalQty   = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, updateQty, clearCart, totalQty, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}