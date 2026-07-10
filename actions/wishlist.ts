"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getServerWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id, product:products(*)")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
}

export async function toggleServerWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId);
  } else {
    await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
  }
  revalidatePath("/wishlist");
}
