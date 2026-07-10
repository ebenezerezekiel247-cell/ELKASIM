import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { AdminProductRowActions } from "@/components/admin/product-row-actions";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Button asChild><Link href="/admin/products/new">Add product</Link></Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bone/60">
            <tr>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-steel">Image</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-steel">Name</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-steel">Category</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-steel">Price</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-steel">Stock</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-steel">Featured</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(products ?? []).map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="relative h-12 w-10 overflow-hidden rounded bg-bone">
                    {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                  </div>
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 font-mono text-xs text-steel">{p.category}</td>
                <td className="p-3 font-mono text-xs">{formatNaira(p.price)}</td>
                <td className="p-3 font-mono text-xs">{p.stock}</td>
                <td className="p-3 font-mono text-xs">{p.featured ? "Yes" : "—"}</td>
                <td className="p-3"><AdminProductRowActions product={p} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
