"use server"

import { db } from "@/db/drizzle"
import { category } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"
import { revalidatePath } from "next/cache"
import { ROLES } from "@/db/types/roles"

type DeleteCategoryResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteCategory(
  categoryId: string
): Promise<DeleteCategoryResult> {
  try {
    const { error, user } = await guardAction()
    if (error) return { success: false, error }

    if (user.role !== ROLES.ADMIN) {
      return { success: false, error: "Unauthorized" }
    }

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
