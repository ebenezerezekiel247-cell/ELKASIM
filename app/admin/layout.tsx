import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/products");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex gap-6">
          <Link href="/admin/products" className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink">
            Products
          </Link>
          <Link href="/admin/orders" className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink">
            Orders
          </Link>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">Sign out</Button>
        </form>
      </div>
      {children}
    </div>
  );
}
