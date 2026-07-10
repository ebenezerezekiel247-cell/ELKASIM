import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elkasimluxury.com";
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("slug, created_at");

  const productUrls = (products ?? []).map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.created_at,
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/shop`, lastModified: new Date() },
    ...productUrls,
  ];
}
