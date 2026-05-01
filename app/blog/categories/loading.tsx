import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <section className="flex flex-col gap-20 mx-auto">
      <header className="text-center space-y-4">
        <Skeleton className="h-14 w-64 mx-auto" />
        <Skeleton className="h-9 w-96 mx-auto" />
      </header>

      <div className="flex flex-col gap-10">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="md:grid md:grid-cols-2 flex flex-col gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 p-6 border rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="size-8 rounded-md shrink-0" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
