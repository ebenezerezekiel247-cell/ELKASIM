"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct } from "@/actions/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().default(""),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = ["Clothing", "Accessories", "Bags", "Beanies", "Caps"];

export function ProductForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { featured: false } });

  const featured = watch("featured");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
      const sign = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sign.apiKey);
      formData.append("timestamp", String(sign.timestamp));
      formData.append("signature", sign.signature);
      formData.append("folder", sign.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploaded = await uploadRes.json();

      setImage({ url: uploaded.secure_url, publicId: uploaded.public_id });
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    if (!image) {
      toast.error("Upload a product image first");
      return;
    }
    setSubmitting(true);
    try {
      await createProduct({
        ...values,
        image_url: image.url,
        cloudinary_public_id: image.publicId,
      });
      toast.success("Product created");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <div>
        <Label>Product image</Label>
        <div className="mt-2 flex items-center gap-4">
          {image ? (
            <div className="relative h-28 w-24 overflow-hidden rounded-md bg-bone">
              <Image src={image.url} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-28 w-24 items-center justify-center rounded-md border border-dashed border-line">
              <UploadCloud className="h-5 w-5 text-steel" />
            </div>
          )}
          <label className="cursor-pointer">
            <span className="inline-flex h-10 items-center rounded-full border border-ink px-4 font-mono text-xs uppercase tracking-widest">
              {uploading ? "Uploading…" : "Choose file"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="mt-1.5" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-rust">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="mt-1.5 w-full rounded-md border border-line bg-paper p-3 text-sm focus-visible:border-ink"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₦)</Label>
          <Input id="price" type="number" step="0.01" className="mt-1.5" {...register("price")} />
          {errors.price && <p className="mt-1 text-xs text-rust">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" className="mt-1.5" {...register("stock")} />
          {errors.stock && <p className="mt-1 text-xs text-rust">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select id="category" className="mt-1.5 h-12 w-full rounded-md border border-line bg-paper px-3 text-sm" {...register("category")}>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="mt-1 text-xs text-rust">{errors.category.message}</p>}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={featured} onChange={(e) => setValue("featured", e.target.checked)} />
        <span className="font-mono text-xs uppercase tracking-widest text-steel">Mark as featured</span>
      </label>

      <Button type="submit" size="lg" disabled={submitting || uploading}>
        {submitting ? "Saving…" : "Create product"}
      </Button>
    </form>
  );
}
