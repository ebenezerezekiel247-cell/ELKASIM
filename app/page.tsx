import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getProducts } from "@/actions/products";
import { ProductGrid } from "@/components/shop/product-grid";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/shop/newsletter";
import { ArrowUpRight } from "lucide-react";

export default async function HomePage() {
  const [featured, newest] = await Promise.all([
    getFeaturedProducts(),
    getProducts().then((p) => p?.slice(0, 8) ?? []),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col justify-end overflow-hidden bg-ink px-5 pb-16 pt-32 text-paper md:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <Image src="/elk-logo.jpg" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative container">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-paper/60">
            Global Fashion World — Lagos
          </p>
          <h1 className="max-w-2xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance md:text-7xl">
            Dressed with intent, not decoration.
          </h1>
          <p className="mt-6 max-w-md font-body text-paper/70">
            EL•KASIM LUXURY is a study in restraint — heavyweight cottons, tonal
            layering, and cuts built to outlast a season.
          </p>
          <div className="mt-9 flex gap-3">
            <Button asChild size="lg" variant="primary" className="bg-paper text-ink hover:bg-paper/90">
              <Link href="/shop">Shop the collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-paper/40 text-paper hover:bg-paper hover:text-ink">
              <Link href="/shop?category=Clothing">New arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Shop by category</h2>
          <Link href="/shop" className="hidden font-mono text-xs uppercase tracking-widest text-steel hover:text-ink md:inline-flex md:items-center md:gap-1">
            View all <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Clothing", "Accessories", "Bags", "Caps"].map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${cat}`}
              className="group relative flex aspect-square items-end overflow-hidden rounded-card bg-bone p-5"
            >
              <span className="font-display text-lg font-semibold transition-transform group-hover:-translate-y-1">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured && featured.length > 0 && (
        <section className="container py-16 md:py-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Featured</h2>
            <Link href="/shop" className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* Newest */}
      <section className="container py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Newest arrivals</h2>
          <Link href="/shop" className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink">
            View all
          </Link>
        </div>
        <ProductGrid products={newest} />
      </section>

      <Newsletter />
    </div>
  );
}
