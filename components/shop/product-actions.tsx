"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { addToServerCart } from "@/actions/cart";
import { toggleServerWishlist } from "@/actions/wishlist";
import type { Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const soldOut = product.stock <= 0;

  function handleAddToCart() {
    addToCart(product, quantity);
    addToServerCart(product.id, quantity).catch(() => {});
    toast(`Added ${quantity} to cart`);
  }

  function handleWishlist() {
    toggleWishlist(product);
    toggleServerWishlist(product.id).catch(() => {});
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {!soldOut && (
        <div className="flex w-fit items-center gap-4 rounded-full border border-line px-4 py-2">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-4 text-center font-mono text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          disabled={soldOut}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4" />
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>
        <Button size="lg" variant="outline" shape="pill" onClick={handleWishlist} aria-label="Toggle wishlist">
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-ink")} />
        </Button>
      </div>
    </div>
  );
}
