"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

type WishlistState = {
  productIds: string[];
  products: Record<string, Product>;
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      products: {},
      toggle: (product) =>
        set((state) => {
          const has = state.productIds.includes(product.id);
          if (has) {
            const { [product.id]: _, ...rest } = state.products;
            return {
              productIds: state.productIds.filter((id) => id !== product.id),
              products: rest,
            };
          }
          return {
            productIds: [...state.productIds, product.id],
            products: { ...state.products, [product.id]: product },
          };
        }),
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: "elk-wishlist" }
  )
);
