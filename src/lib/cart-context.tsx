"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

type CartItem = {
  slug: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  color?: string;
  variant?: string;
};

type CartAction =
  | { type: "ADD"; item: Partial<CartItem> & Pick<CartItem, "slug" | "name" | "price" | "size"> }
  | { type: "REMOVE"; slug: string; size: string }
  | { type: "UPDATE_QTY"; slug: string; size: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

type CartContextValue = {
  items: CartItem[];
  addToCart: (item: Partial<CartItem> & Pick<CartItem, "slug" | "name" | "price" | "size">) => void;
  removeItem: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clearCart: () => void;
  totalQty: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        (i) => i.slug === action.item.slug && i.size === action.item.size,
      );
      if (existing) {
        return state.map((i) =>
          i.slug === action.item.slug && i.size === action.item.size
            ? { ...i, qty: i.qty + (action.item.qty ?? 1) }
            : i,
        );
      }
      return [...state, { ...action.item, qty: action.item.qty ?? 1 } as CartItem];
    }
    case "REMOVE":
      return state.filter((i) => !(i.slug === action.slug && i.size === action.size));
    case "UPDATE_QTY":
      return state.map((i) =>
        i.slug === action.slug && i.size === action.size
          ? { ...i, qty: Math.max(1, action.qty) }
          : i,
      );
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [] as CartItem[]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aa_cart");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) as CartItem[] });
    } catch {
      // ignore bad local data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aa_cart", JSON.stringify(items));
  }, [items]);

  const addToCart: CartContextValue["addToCart"] = (item) => dispatch({ type: "ADD", item });
  const removeItem = (slug: string, size: string) => dispatch({ type: "REMOVE", slug, size });
  const updateQty = (slug: string, size: string, qty: number) => dispatch({ type: "UPDATE_QTY", slug, size, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
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
