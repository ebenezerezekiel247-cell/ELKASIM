import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="hidden border-t border-line md:block">
      <div className="container grid grid-cols-4 gap-8 py-16">
        <div className="col-span-2 flex flex-col gap-4">
          <Logo size={44} />
          <p className="max-w-xs font-body text-sm text-steel">
            Minimal, monochrome streetwear out of Lagos — built for people who
            dress with intent.
          </p>
        </div>
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-steel">Shop</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/shop" className="hover:opacity-60">All products</Link></li>
            <li><Link href="/shop?category=Clothing" className="hover:opacity-60">Clothing</Link></li>
            <li><Link href="/shop?category=Accessories" className="hover:opacity-60">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-steel">Support</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/account/orders" className="hover:opacity-60">Track order</Link></li>
            <li><Link href="/login" className="hover:opacity-60">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6">
        <p className="container font-mono text-[11px] uppercase tracking-widest text-steel">
          © {new Date().getFullYear()} EL•KASIM LUXURY. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
