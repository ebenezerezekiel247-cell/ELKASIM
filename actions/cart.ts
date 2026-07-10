"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Server-side cart is the source of truth once a user is signed in. */
export async function getServerCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart")
    .select("product_id, quantity, product:products(*)")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
}

export async function addToServerCart(productId: string, quantity = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // guests use the local Zustand cart only

  const { error } = await supabase
    .from("cart")
    .upsert(
      { user_id: user.id, product_id: productId, quantity },
      { onConflict: "user_id,product_id", ignoreDuplicates: false }
    );
  if (error) throw error;
  revalidatePath("/cart");
}

export async function updateCartQuantity(productId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (quantity <= 0) {
    await supabase.from("cart").delete().eq("user_id", user.id).eq("product_id", productId);
  } else {
    await supabase
      .from("cart")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);
  }
  revalidatePath("/cart");
}

export async function removeFromServerCart(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("cart").delete().eq("user_id", user.id).eq("product_id", productId);
  revalidatePath("/cart");
}

export async function clearServerCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("cart").delete().eq("user_id", user.id);
  revalidatePath("/cart");
}
