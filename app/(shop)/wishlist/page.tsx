"use client";

import Link from "next/link";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { ProductGrid } from "@/components/shop/product-grid";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const products = useWishlistStore((s) => Object.values(s.products));

  if (products.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your wishlist is empty</h1>
        <p className="font-mono text-xs text-steel">Save pieces you're eyeing for later.</p>
        <Button asChild className="mt-2">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-6 font-display text-2xl font-bold md:text-3xl">Wishlist</h1>
      <ProductGrid products={products} />
    </div>
  );
}
