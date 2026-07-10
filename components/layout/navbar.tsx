"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./logo";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Clothing", label: "Clothing" },
  { href: "/shop?category=Accessories", label: "Accessories" },
  { href: "/account/orders", label: "Orders" },
];

export function Navbar() {
  const cartCount = useCartStore((s) => s.count());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Left: menu (mobile) / links (desktop) */}
        <div className="flex flex-1 items-center gap-6">
          <button
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-widest text-steel transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: logo */}
        <Logo size={44} />

        {/* Right: search, wishlist, cart, account */}
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
          <Link href="/shop" aria-label="Search" className="hidden md:inline-flex">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative hidden md:inline-flex">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink font-mono text-[9px] text-paper">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink font-mono text-[9px] text-paper">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/account/orders" aria-label="Account" className="hidden md:inline-flex">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed left-0 top-0 z-50 h-full w-72 bg-paper p-6 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between">
                <Logo size={40} />
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-10 flex flex-col gap-5">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-lg font-semibold text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
