import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction, koboToNaira } from "@/lib/paystack";

/**
 * Called from the client after Paystack redirects back to /checkout/success.
 * Re-verifies the reference directly against Paystack (never trusts the redirect
 * itself), then finalizes the order: marks it paid, decrements stock, clears cart.
 * The webhook route below performs the same finalization idempotently in case
 * this call never fires (e.g. the user closes the tab).
 */
export async function POST(req: NextRequest) {
  const { reference } = await req.json();
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const verification = await verifyTransaction(reference);

  if (!verification.status || verification.data.status !== "success") {
    return NextResponse.json({ status: "failed" }, { status: 200 });
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("payment_reference", reference)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found for this reference" }, { status: 404 });
  }

  // Idempotent: if already marked paid (e.g. webhook beat us to it), just return success.
  if (order.status === "paid") {
    return NextResponse.json({ status: "success", orderId: order.id });
  }

  const paidAmount = koboToNaira(verification.data.amount);
  if (Math.round(paidAmount) !== Math.round(order.amount)) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  await admin.from("orders").update({ status: "paid" }).eq("id", order.id);

  for (const item of order.order_items) {
    await admin.rpc("decrement_stock", {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
  }

  await admin.from("cart").delete().eq("user_id", user.id);

  return NextResponse.json({ status: "success", orderId: order.id });
}
