import { Skeleton } from "@/components/ui/skeleton";


export const FavoriteItemSkeleton = () => (
  <div className="flex gap-4 p-5">
    <Skeleton className="h-24 w-24 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="h-8 w-20 rounded-full shrink-0" />
  </div>
)