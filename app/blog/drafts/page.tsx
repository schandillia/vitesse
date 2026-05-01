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
    <section className="mx-auto max-w-4xl px-4 pb-10">
      <header className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">My Drafts</h1>
        <p className="text-muted-foreground">
          {result.drafts.length === 0
            ? "You have no drafts."
            : `${result.drafts.length} unpublished ${result.drafts.length === 1 ? "post" : "posts"}`}
        </p>
      </header>

      <DraftsList drafts={result.drafts} />
    </section>
  )
}
