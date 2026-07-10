"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { updateCartQuantity, removeFromServerCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";

const SHIPPING_FLAT_RATE = 5000;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());

  const shipping = items.length > 0 ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + shipping;

  function changeQty(productId: string, qty: number) {
    setQuantity(productId, qty);
    updateCartQuantity(productId, qty).catch(() => {});
  }

  function removeItem(productId: string) {
    remove(productId);
    removeFromServerCart(productId).catch(() => {});
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="font-mono text-xs text-steel">Add something you'll actually wear.</p>
        <Button asChild className="mt-2">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container grid gap-10 py-8 md:grid-cols-3 md:py-12">
      <div className="md:col-span-2">
        <h1 className="mb-6 font-display text-2xl font-bold md:text-3xl">Your cart</h1>
        <div className="flex flex-col divide-y divide-line">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 py-5">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-bone">
                {product.image_url && (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/product/${product.slug}`} className="font-display text-sm font-semibold">
                      {product.name}
                    </Link>
                    <p className="font-mono text-xs text-steel">{formatNaira(product.price)}</p>
                  </div>
                  <button onClick={() => removeItem(product.id)} aria-label="Remove item">
                    <X className="h-4 w-4 text-steel" />
                  </button>
                </div>
                <div className="flex w-fit items-center gap-3 rounded-full border border-line px-3 py-1.5">
                  <button onClick={() => changeQty(product.id, quantity - 1)} aria-label="Decrease">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-4 text-center font-mono text-xs">{quantity}</span>
                  <button onClick={() => changeQty(product.id, quantity + 1)} aria-label="Increase">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-card border border-line p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Summary</h2>
        <div className="flex flex-col gap-2 font-mono text-sm">
          <div className="flex justify-between"><span className="text-steel">Subtotal</span><span>{formatNaira(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-steel">Shipping</span><span>{formatNaira(shipping)}</span></div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-semibold">
            <span>Total</span><span>{formatNaira(total)}</span>
          </div>
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
