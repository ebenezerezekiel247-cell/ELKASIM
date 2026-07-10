"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Star } from "lucide-react";
import { deleteProduct, updateProduct } from "@/actions/products";
import type { Product } from "@/types";
import { toast } from "sonner";

export function AdminProductRowActions({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleFeatured() {
    startTransition(async () => {
      await updateProduct(product.id, { featured: !product.featured } as any);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This also removes its Cloudinary image.`)) return;
    startTransition(async () => {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={toggleFeatured} disabled={isPending} aria-label="Toggle featured">
        <Star className={`h-4 w-4 ${product.featured ? "fill-ink text-ink" : "text-steel"}`} />
      </button>
      <button onClick={handleDelete} disabled={isPending} aria-label="Delete product">
        <Trash2 className="h-4 w-4 text-steel hover:text-rust" />
      </button>
    </div>
  );
}
