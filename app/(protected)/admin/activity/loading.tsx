import { Skeleton } from "@/components/ui/skeleton"

export default function AdminActivityLoading() {
  return (
    <div className="container space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>

      <Skeleton className="h-9 w-40" />

      <div className="rounded-xl border">
        <div className="p-4 border-b flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border-b last:border-0 flex items-center gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
