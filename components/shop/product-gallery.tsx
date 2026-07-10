"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/types";

export function ProductGallery({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-bone"
    >
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-xs text-steel">
          No image
        </div>
      )}
    </motion.div>
  );
}
