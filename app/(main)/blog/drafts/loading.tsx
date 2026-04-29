import { DraftCardSkeletonGrid } from "@/app/(main)/blog/components/draft-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function DraftsLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10">
      <header className="mb-8 space-y-1">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-48" />
      </header>

      <DraftCardSkeletonGrid />
    </section>
  )
}
