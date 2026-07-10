import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutFailedPage() {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <XCircle aria-hidden="true" className="h-12 w-12 text-ink" />
      <h1 className="font-display text-2xl font-bold">Payment failed</h1>
      <p className="max-w-sm font-body text-sm text-steel">
        Your payment didn't go through. No charge was made — you can try again.
      </p>
      <Button asChild className="mt-2">
        <Link href="/checkout">Try again</Link>
      </Button>
    </div>
  );
}
