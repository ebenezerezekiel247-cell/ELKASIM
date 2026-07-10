import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/shop/product-grid";
import { CategoryPills } from "@/components/shop/category-pills";
import { ShopControls } from "@/components/shop/shop-controls";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop" };

// This page reads searchParams and must always reflect the current filter —
// force it out of any static/ISR caching path so a category, sort, or search
// change is never served a stale, previously-cached result set.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const sort = params.sort ?? "newest";

  const supabase = await createClient();
  let query = supabase.from("products").select("*", { count: "exact" });

  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data: products, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Shop all</h1>
          <p className="mt-1 font-mono text-xs text-steel">
            Showing {products?.length ?? 0} of {count ?? 0} products
          </p>
        </div>
        <ShopControls />
      </div>

      <div className="mb-6">
        <CategoryPills active={params.category} />
      </div>

      <ProductGrid products={products ?? []} />

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const search = new URLSearchParams({
              ...(params.category ? { category: params.category } : {}),
              ...(params.q ? { q: params.q } : {}),
              ...(params.sort ? { sort: params.sort } : {}),
              page: String(p),
            });
            return (
              <Link
                key={p}
                href={`/shop?${search.toString()}`}
                aria-label={`Go to page ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs ${
                  p === page ? "bg-ink text-paper" : "border border-line text-steel hover:border-ink hover:text-ink"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
