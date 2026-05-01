import { requireAdmin } from "@/lib/blog-utils"
import { getCategories } from "@/actions/get-categories"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CategoryManagerClient } from "@/app/blog/categories/components/category-manager-client"

export const metadata: Metadata = {
  title: "Manage Categories",
  robots: { index: false },
}

export const revalidate = 0 // Always fresh — admin only

export default async function CategoriesPage() {
  const { authorized } = await requireAdmin()
  if (!authorized) notFound()

  const categories = await getCategories()

  return (
    <section className="flex flex-col gap-20 mx-auto">
      <header className="font-bold text-foreground text-center space-y-4">
        <h1 className="text-4xl/tight md:text-6xl">Categories</h1>
        <h2 className="text-2xl/tight md:text-4xl text-muted-foreground">
          Create, edit, and delete post categories.
        </h2>
      </header>

      <CategoryManagerClient initialCategories={categories} />
    </section>
  )
}
