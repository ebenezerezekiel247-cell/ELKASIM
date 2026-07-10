import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction, nairaToKobo } from "@/lib/paystack";
import { generateOrderReference } from "@/lib/utils";
import { z } from "zod";

const bodySchema = z.object({
  items: z.array(
    z.object({ product_id: z.string().uuid(), quantity: z.number().int().positive() })
  ).min(1),
});

/**
 * Recomputes the order total from live product prices/stock on the server —
 * the client only tells us which product IDs and quantities are in the cart.
 * This is what "never trust the frontend" means in practice for this flow.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const productIds = parsed.data.items.map((i) => i.product_id);
  const { data: products, error } = await supabase
    .from("products")
    .select("id, price, stock, name")
    .in("id", productIds);

  if (error || !products) {
    return NextResponse.json({ error: "Could not load products" }, { status: 500 });
  }

  let amount = 0;
  for (const item of parsed.data.items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) {
      return NextResponse.json({ error: `Product ${item.product_id} not found` }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 });
    }
    amount += product.price * item.quantity;
  }

  const reference = generateOrderReference();

  const init = await initializeTransaction({
    email: user.email!,
    amountKobo: nairaToKobo(amount),
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    metadata: { user_id: user.id },
  });

  if (!init.status) {
    return NextResponse.json({ error: init.message }, { status: 500 });
  }

  return NextResponse.json({
    authorization_url: init.data.authorization_url,
    reference: init.data.reference,
    amount,
  });
}
