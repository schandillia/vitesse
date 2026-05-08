import { getServerSession } from "@/lib/auth/get-server-session"
import { ROLES } from "@/db/types/roles"
import { getCategories } from "@/actions/get-categories"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CategoryManagerClient } from "@/app/blog/categories/components/category-manager-client"

export const metadata: Metadata = {
  title: "Manage Categories",
  robots: { index: false },
}

export const revalidate = 0

export default async function CategoriesPage() {
  const session = await getServerSession()
  if (!session?.user || session.user.role !== ROLES.ADMIN) notFound()

  const categories = await getCategories()

  return (
    <section className="flex flex-col gap-20 mx-auto max-w-6xl px-4 md:px-8 py-10">
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
