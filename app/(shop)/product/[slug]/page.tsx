import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/actions/products";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductActions } from "@/components/shop/product-actions";
import { ProductGrid } from "@/components/shop/product-grid";
import { formatNaira } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const products = await getProducts();
  return (products ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.image_url ? [product.image_url] : [] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery product={product} />

        <div className="flex flex-col">
          <p className="font-mono text-xs uppercase tracking-widest text-steel">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">{product.name}</h1>
          <p className="mt-4 font-mono text-xl">{formatNaira(product.price)}</p>

          <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-steel">
            {product.description}
          </p>

          <p className="mt-4 font-mono text-xs text-steel">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently sold out"}
          </p>

          <ProductActions product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
