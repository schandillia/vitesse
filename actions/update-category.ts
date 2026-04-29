"use server"

import { db } from "@/db/drizzle"
import { category } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import {
  getDuplicateKeyField,
  isDuplicateKeyError,
  requireAdmin,
} from "@/lib/blog-utils"
import { revalidatePath } from "next/cache"
import { categorySchema } from "@/lib/validations/blog-schema"

type UpdateCategoryInput = {
  id: string
  name?: string
  slug?: string
  description?: string
}

type UpdateCategoryResult =
  | { success: true }
  | { success: false; error: string }

export async function updateCategory(
  input: UpdateCategoryInput
): Promise<UpdateCategoryResult> {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return { success: false, error: "Unauthorized" }

    const existing = await db.query.category.findFirst({
      where: eq(category.id, input.id),
      columns: { id: true, slug: true },
    })

    if (!existing) return { success: false, error: "Category not found." }

    const validation = categorySchema.partial().safeParse({
      name: input.name?.trim(),
      slug: input.slug?.trim().toLowerCase(),
      description: input.description?.trim(),
    })

    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message }
    }

    const updates: Record<string, unknown> = {}

    if (input.name !== undefined) updates.name = input.name.trim()
    if (input.slug !== undefined)
      updates.slug = input.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
    if (input.description !== undefined)
      updates.description = input.description.trim() || null

    if (Object.keys(updates).length === 0) return { success: true }

    await db.update(category).set(updates).where(eq(category.id, input.id))

    revalidatePath("/blog/categories")
    revalidatePath("/blog")
    revalidatePath(`/blog/category/${existing.slug}`)

    if (typeof updates.slug === "string" && updates.slug !== existing.slug) {
      revalidatePath(`/blog/category/${updates.slug}`)
    }

    return { success: true }
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      const field = getDuplicateKeyField(error)
      return {
        success: false,
        error:
          field === "name"
            ? "A category with this name already exists."
            : "This slug is already taken. Please choose a different one.",
      }
    }

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: message }
  }
}
