import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-paper/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-steel",
        className
      )}
    >
      {children}
    </span>
  );
}
