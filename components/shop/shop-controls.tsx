"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function ShopControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlSort = searchParams.get("sort") ?? "newest";

  const [q, setQ] = useState(urlQuery);

  // Keep the search box in sync whenever the URL's own "q" changes from
  // elsewhere — a category pill click, browser back/forward, or a shared
  // link — not just when this component's own input fires onChange.
  useEffect(() => {
    setQ(urlQuery);
  }, [urlQuery]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <div className="relative flex-1 md:w-64">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel"
        />
        <Input
          type="search"
          aria-label="Search products"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateParam("q", q)}
          className="pl-9"
        />
      </div>
      {/* Controlled (not defaultValue) so it reflects the URL's current
          sort even when changed from outside this component. */}
      <select
        aria-label="Sort products"
        value={urlSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="h-12 rounded-md border border-line bg-paper px-3 font-mono text-xs uppercase tracking-wide text-ink"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
