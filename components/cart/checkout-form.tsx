"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/hooks/use-cart-store";
import { createPendingOrder } from "@/actions/orders";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";

const shippingSchema = z.object({
  full_name: z.string().min(2, "Required"),
  phone: z.string().min(7, "Required"),
  line1: z.string().min(3, "Required"),
  line2: z.string().optional(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  country: z.string().default("Nigeria"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const SHIPPING_FLAT_RATE = 5000;

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const [loading, setLoading] = useState(false);
  const total = subtotal + (items.length > 0 ? SHIPPING_FLAT_RATE : 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { country: "Nigeria" },
  });

  async function onSubmit(shipping: ShippingForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Could not start checkout");
        setLoading(false);
        return;
      }

      await createPendingOrder({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        amount: data.amount,
        shippingAddress: shipping,
        reference: data.reference,
      });

      window.location.href = data.authorization_url;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 md:grid-cols-3">
      <div className="flex flex-col gap-5 md:col-span-2">
        <h2 className="font-display text-lg font-semibold">Shipping details</h2>

        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" className="mt-1.5" {...register("full_name")} />
          {errors.full_name && <p className="mt-1 text-xs text-rust">{errors.full_name.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" className="mt-1.5" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-rust">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="line1">Address</Label>
          <Input id="line1" className="mt-1.5" {...register("line1")} />
          {errors.line1 && <p className="mt-1 text-xs text-rust">{errors.line1.message}</p>}
        </div>

        <div>
          <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
          <Input id="line2" className="mt-1.5" {...register("line2")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" className="mt-1.5" {...register("city")} />
            {errors.city && <p className="mt-1 text-xs text-rust">{errors.city.message}</p>}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" className="mt-1.5" {...register("state")} />
            {errors.state && <p className="mt-1 text-xs text-rust">{errors.state.message}</p>}
          </div>
        </div>
      </div>

      <div className="h-fit rounded-card border border-line p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Order summary</h2>
        <div className="flex flex-col gap-3 border-b border-line pb-4">
          {items.map((i) => (
            <div key={i.product.id} className="flex justify-between font-mono text-xs">
              <span className="text-steel">{i.product.name} × {i.quantity}</span>
              <span>{formatNaira(i.product.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 font-mono text-sm">
          <div className="flex justify-between"><span className="text-steel">Subtotal</span><span>{formatNaira(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-steel">Shipping</span><span>{formatNaira(SHIPPING_FLAT_RATE)}</span></div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-semibold">
            <span>Total</span><span>{formatNaira(total)}</span>
          </div>
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading || items.length === 0}>
          {loading ? "Redirecting to Paystack…" : "Pay with Paystack"}
        </Button>
      </div>
    </form>
  );
}
