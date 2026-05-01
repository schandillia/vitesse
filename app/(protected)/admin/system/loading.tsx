import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function SkeletonEnvColumn() {
  return (
    <div className="rounded-xl border divide-y shadow-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3">
          <Skeleton className="h-4 w-28 shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

function SkeletonHealthCard() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-8 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Skeleton className="h-8 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonLegend() {
  return (
    <div className="rounded-xl border shadow-none overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-4 px-4 py-2 bg-muted/50 border-b gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-16" />
        ))}
      </div>
      {/* 3 data rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 px-4 py-3 border-b last:border-b-0 gap-4 items-center"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="size-2 rounded-full shrink-0" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}

export default function SystemLoading() {
  return (
    <div className="flex flex-col gap-10">
      {/* GatedPageTitle skeleton — includes mobile sidebar trigger */}
      <div className="flex flex-col gap-1 mb-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-md md:hidden" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Environment section */}
      <section className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonEnvColumn />
          <SkeletonEnvColumn />
        </div>
      </section>

      {/* Infrastructure section */}
      <section className="flex flex-col gap-4">
        {/* Section header with Refresh button */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        {/* Health cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonHealthCard />
          <SkeletonHealthCard />
        </div>
        {/* Legend */}
        <SkeletonLegend />
      </section>
    </div>
  )
}
