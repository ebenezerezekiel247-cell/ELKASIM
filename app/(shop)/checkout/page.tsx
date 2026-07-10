import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="mb-8 font-display text-2xl font-bold md:text-3xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
