"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2X2, Heart, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Categories", icon: Grid2X2 },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/orders", label: "Profile", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-line bg-paper/95 backdrop-blur md:hidden">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Icon
              aria-hidden="true"
              className={cn("h-5 w-5", active ? "text-ink" : "text-steel")}
              strokeWidth={active ? 2 : 1.5}
            />
            <span className={cn("font-mono text-[9px] uppercase tracking-wide", active ? "text-ink" : "text-steel")}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
