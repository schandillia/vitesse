"use server"

import { db } from "@/db/drizzle"
import { category } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/blog-utils"
import { revalidatePath } from "next/cache"

type DeleteCategoryResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteCategory(
  categoryId: string
): Promise<DeleteCategoryResult> {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return { success: false, error: "Unauthorized" }

    const existing = await db.query.category.findFirst({
      where: eq(category.id, categoryId),
      columns: { id: true, slug: true },
    })

    if (!existing) return { success: false, error: "Category not found." }

    await db.delete(category).where(eq(category.id, categoryId))

    revalidatePath("/blog/categories")
    revalidatePath("/blog")
    revalidatePath(`/blog/category/${existing.slug}`)

    return { success: true }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: message }
  }
}
