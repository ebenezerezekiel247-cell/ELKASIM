"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().default(""),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().default(false),
  image_url: z.string().url(),
  cloudinary_public_id: z.string().min(1),
});

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Not authorized");
  return user;
}

export async function getProducts(filters?: { category?: string; search?: string }) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }
  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getRelatedProducts(category: string, excludeId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", excludeId)
    .limit(4);
  return data ?? [];
}

/** Admin: create a product. Image must already be uploaded to Cloudinary. */
export async function createProduct(input: z.infer<typeof productSchema>) {
  await assertAdmin();
  const parsed = productSchema.parse(input);
  const admin = createAdminClient();

  const slug = slugify(parsed.name);
  const { error } = await admin.from("products").insert({ ...parsed, slug });
  if (error) throw error;

  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, input: Partial<z.infer<typeof productSchema>>) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("products").update(input).eq("id", id);
  if (error) throw error;

  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

/** Admin: delete a product and its Cloudinary asset together. */
export async function deleteProduct(id: string) {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: product } = await admin
    .from("products")
    .select("cloudinary_public_id")
    .eq("id", id)
    .single();

  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw error;

  if (product?.cloudinary_public_id) {
    await deleteCloudinaryAsset(product.cloudinary_public_id);
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
}
