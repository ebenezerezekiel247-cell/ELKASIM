import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Signature mark: the ELK ring badge. On hover the outer ring slowly rotates —
 * a quiet nod to the badge's own circular form, used nowhere else in the UI
 * so it stays a signature rather than a decoration.
 */
export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="EL•KASIM LUXURY home">
      <span
        className="relative inline-flex shrink-0 items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-0 rounded-full border border-ink/15 transition-transform duration-[3000ms] ease-linear group-hover:rotate-[360deg]" />
        <Image
          src="/elk-logo.jpg"
          alt="EL•KASIM LUXURY"
          width={size}
          height={size}
          className="rounded-full object-cover p-[3px]"
          priority
        />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-sm font-bold tracking-tight text-ink">EL•KASIM</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel">Luxury</span>
      </span>
    </Link>
  );
}
