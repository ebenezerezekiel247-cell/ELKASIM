import Link from "next/link";
import Image from "next/image";
import { getUserOrders } from "@/actions/orders";
import { formatNaira } from "@/lib/utils";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Your orders" };

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Your orders</h1>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">Sign out</Button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-mono text-xs text-steel">You haven't placed any orders yet.</p>
          <Button asChild><Link href="/shop">Start shopping</Link></Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-card border border-line p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-steel">
                    {new Date(order.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                  </p>
                  <p className="font-mono text-xs text-steel">Ref: {order.payment_reference}</p>
                </div>
                <Badge className="capitalize">{order.status}</Badge>
              </div>
              <div className="flex flex-col gap-3 border-t border-line pt-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-bone">
                      {item.product?.image_url && (
                        <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-sm font-medium">{item.product?.name}</p>
                      <p className="font-mono text-xs text-steel">Qty {item.quantity} × {formatNaira(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end border-t border-line pt-4 font-mono text-sm font-semibold">
                Total: {formatNaira(order.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
