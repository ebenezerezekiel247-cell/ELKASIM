import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
