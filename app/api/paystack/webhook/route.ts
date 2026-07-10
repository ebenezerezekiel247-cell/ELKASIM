import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { koboToNaira } from "@/lib/paystack";

/**
 * Paystack webhook — the durable source of truth for payment confirmation,
 * independent of whether the client's browser ever returns from checkout.
 * Configure this URL (https://yourdomain.com/api/paystack/webhook) in the
 * Paystack dashboard. Signature is verified before anything is trusted.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expectedSignature = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const { reference, amount } = event.data;
    const admin = createAdminClient();

    const { data: order } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("payment_reference", reference)
      .single();

    if (order && order.status !== "paid") {
      const paidAmount = koboToNaira(amount);
      if (Math.round(paidAmount) === Math.round(order.amount)) {
        await admin.from("orders").update({ status: "paid" }).eq("id", order.id);

        for (const item of order.order_items) {
          await admin.rpc("decrement_stock", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }

        await admin.from("cart").delete().eq("user_id", order.user_id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
