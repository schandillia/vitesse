import { Skeleton } from "@/components/ui/skeleton"

export function DraftCardSkeleton() {
  return (
    <article className="flex flex-col gap-4 p-6 border rounded-xl">
      {/* Title */}
      <Skeleton className="h-8 w-3/4" />

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t">
        {/* Timestamp */}
        <Skeleton className="h-4 w-36" />

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </article>
  )
}

export function DraftCardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <DraftCardSkeleton key={i} />
      ))}
    </div>
  )
}
