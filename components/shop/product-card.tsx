"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { cn, formatNaira } from "@/lib/utils";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const soldOut = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-bone">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-steel">
              No image
            </div>
          )}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/70">
              <span className="font-mono text-xs uppercase tracking-widest text-ink">Sold out</span>
            </div>
          )}

          {/* Floating wishlist button */}
          <button
            aria-label="Toggle wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
              toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 shadow-sm backdrop-blur transition-transform active:scale-90"
          >
            <Heart
              className={cn("h-4 w-4", isWishlisted ? "fill-ink text-ink" : "text-ink")}
              strokeWidth={1.5}
            />
          </button>

          {/* Floating add-to-cart button */}
          {!soldOut && (
            <button
              aria-label="Add to cart"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                toast("Added to cart");
              }}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper shadow-md transition-transform active:scale-90"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
            {product.category}
          </p>
          <h3 className="font-display text-sm font-semibold leading-snug text-ink line-clamp-1">
            {product.name}
          </h3>
          <p className="font-mono text-sm text-ink">{formatNaira(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
