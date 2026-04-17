

export const SkeletonCardLoading = () => {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200" />
        <div className="p-3 flex flex-col gap-2">
          <div className="h-2 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
        </div>
    </div>
  )
}
