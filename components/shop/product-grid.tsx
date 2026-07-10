import { ProductCard } from "./product-card";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <p className="font-display text-lg font-semibold text-ink">No products found</p>
        <p className="font-mono text-xs text-steel">Try a different category or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
