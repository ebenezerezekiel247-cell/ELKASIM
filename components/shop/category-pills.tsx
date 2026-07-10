"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Clothing", "Accessories", "Bags", "Beanies", "Caps"];

export function CategoryPills({ active }: { active?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    // A category change invalidates whatever page you were on — e.g. you're
    // on page 2 of "All", tap "Bags" (which only has 1 page of results), and
    // without this the grid comes back empty because it's still requesting
    // page 2. That reads as "the filter did nothing" when really the page
    // just went stale.
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="scrollbar-none sticky top-16 z-30 -mx-5 flex gap-2 overflow-x-auto border-b border-line bg-paper/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:border-none md:bg-transparent md:px-0">
      {CATEGORIES.map((cat) => {
        const isActive = (active ?? "All") === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => select(cat)}
            aria-pressed={isActive}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
              isActive ? "border-ink bg-ink text-paper" : "border-line text-steel hover:border-ink hover:text-ink"
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
