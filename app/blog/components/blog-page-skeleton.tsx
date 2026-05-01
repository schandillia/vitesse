import { Skeleton } from "@/components/ui/skeleton"

function PostCardSkeleton() {
  return (
    <article className="flex flex-col gap-4 p-6 border rounded-xl">
      {/* Category */}
      <Skeleton className="h-4 w-24" />

      {/* Title */}
      <Skeleton className="h-8 w-3/4" />

      {/* Excerpt */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
    </article>
  )
}

export function BlogPageSkeleton() {
  return (
    <section className="flex flex-col gap-20 mx-auto max-w-6xl px-4 md:px-8 py-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="h-14 w-2/3 md:h-20" />
        <Skeleton className="h-8 w-1/2 md:h-12" />
      </header>

      <div className="md:grid md:grid-cols-2 flex flex-col gap-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
