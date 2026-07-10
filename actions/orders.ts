"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { OrderStatus } from "@/types";

const addressSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default("Nigeria"),
});

/**
 * Creates a pending order + order_items server-side, BEFORE redirecting to Paystack.
 * The order stays "pending" until /api/paystack/verify or the webhook confirms payment —
 * the frontend never marks an order paid on its own.
 */
export async function createPendingOrder(input: {
  items: { product_id: string; quantity: number; price: number }[];
  amount: number;
  shippingAddress: z.infer<typeof addressSchema>;
  reference: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be signed in to check out");

  const address = addressSchema.parse(input.shippingAddress);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      amount: input.amount,
      status: "pending",
      payment_reference: input.reference,
      shipping_address: address,
    })
    .select()
    .single();

  if (error) throw error;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  if (itemsError) throw itemsError;

  return order;
}

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/** Admin: all orders, most recent first. */
export async function getAllOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) throw new Error("Not authorized");

  const admin = createAdminClient();
  const { error } = await admin.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;

  revalidatePath("/admin/orders");
}
