import { Skeleton } from "@/components/ui/skeleton";


export const CartItemSkeleton = () => (
  <div className="flex gap-4 p-5">
    <Skeleton className="h-24 w-24 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="flex flex-col items-end gap-3">
      <Skeleton className="h-8 w-24 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
)