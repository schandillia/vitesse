import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <article className="mx-auto max-w-4xl pb-10 px-4">
      {/* Breadcrumbs */}
      <Skeleton className="h-4 w-48 mb-6" />

      <header className="mb-8 space-y-4 text-center md:text-left">
        <div className="space-y-2">
          {/* Category pill */}
          <Skeleton className="h-5 w-24 rounded-full" />
          {/* Title */}
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          {/* Logline */}
          <Skeleton className="h-7 w-2/3" />
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: avatar + author + date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Right: edit + unpublish buttons (admin only, shown as placeholder) */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </header>

      {/* Cover image */}
      <Skeleton className="w-full aspect-video mb-10 rounded-xl" />

      {/* Content */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  )
}
