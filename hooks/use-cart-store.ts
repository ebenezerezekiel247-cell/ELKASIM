"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

type LocalCartItem = { product: Product; quantity: number };

type CartState = {
  items: LocalCartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

/**
 * Client-side cart cache for guests and instant UI feedback.
 * Signed-in users' carts are the source of truth in Supabase (see actions/cart.ts);
 * this store mirrors that state and is what guests use before they log in.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.product.id === productId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "elk-cart" }
  )
);
