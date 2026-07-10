"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }
    fetch("/api/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          clearCart();
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference, clearCart]);

  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      {status === "verifying" && (
        <>
          <Loader2 aria-hidden="true" className="h-10 w-10 animate-spin text-steel" />
          <h1 className="font-display text-2xl font-bold">Confirming your payment…</h1>
          <p className="font-mono text-xs text-steel">Please don't close this page.</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-ink" />
          <h1 className="font-display text-2xl font-bold">Order confirmed</h1>
          <p className="max-w-sm font-body text-sm text-steel">
            Thank you for shopping EL•KASIM LUXURY. A confirmation has been sent to your email.
          </p>
          <Button asChild className="mt-2">
            <Link href="/account/orders">View order</Link>
          </Button>
        </>
      )}
      {status === "failed" && (
        <>
          <XCircle aria-hidden="true" className="h-12 w-12 text-ink" />
          <h1 className="font-display text-2xl font-bold">Payment not confirmed</h1>
          <p className="max-w-sm font-body text-sm text-steel">
            We couldn't verify this payment. If you were charged, contact support with your reference.
          </p>
          <Button asChild className="mt-2">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </>
      )}
    </div>
  );
}
