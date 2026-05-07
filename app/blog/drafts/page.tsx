import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/blog-utils"
import { getDrafts } from "@/actions/get-drafts"
import { DraftsList } from "@/app/blog/components/drafts-list"

export default async function DraftsPage() {
  const { authorized } = await requireAdmin()

  if (!authorized) {
    redirect("/blog")
  }

  const result = await getDrafts()

  if (!result.success) {
    throw new Error(result.error)
  }

  return (
    <section className="flex flex-col gap-20 mx-auto max-w-6xl px-4 md:px-8 py-10">
      <header className="font-bold text-foreground text-center space-y-4">
        <h1 className="text-4xl/tight md:text-6xl">My Drafts</h1>
        <h2 className="text-2xl/tight md:text-4xl text-muted-foreground/60">
          {result.drafts.length === 0
            ? "You have no drafts."
            : `${result.drafts.length} unpublished ${result.drafts.length === 1 ? "post" : "posts"}`}
        </h2>
      </header>

      <DraftsList drafts={result.drafts} />
    </section>
  )
}
