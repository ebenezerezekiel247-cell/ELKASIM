import { getAllOrders } from "@/actions/orders";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-card border border-line p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-steel">
                  {new Date(order.created_at).toLocaleString("en-NG")}
                </p>
                <p className="font-mono text-xs text-steel">Ref: {order.payment_reference}</p>
                <p className="font-mono text-xs text-steel">{order.shipping_address?.full_name} — {order.shipping_address?.phone}</p>
              </div>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>
            <ul className="border-t border-line pt-3 font-mono text-xs text-steel">
              {order.order_items?.map((item: any) => (
                <li key={item.id}>{item.product?.name} × {item.quantity} — {formatNaira(item.price)}</li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-3 text-right font-mono text-sm font-semibold">
              Total: {formatNaira(order.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
