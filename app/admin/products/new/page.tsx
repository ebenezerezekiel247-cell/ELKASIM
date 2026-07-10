import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Admin — New product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Add product</h1>
      <ProductForm />
    </div>
  );
}
