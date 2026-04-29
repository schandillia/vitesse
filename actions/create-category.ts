"use server"

import { db } from "@/db/drizzle"
import { category } from "@/db/blog-schema"
import { randomUUID } from "crypto"
import {
  getDuplicateKeyField,
  isDuplicateKeyError,
  requireAdmin,
} from "@/lib/blog-utils"
import { revalidatePath } from "next/cache"
import { categorySchema } from "@/lib/validations/blog-schema"

type CreateCategoryInput = {
  name: string
  slug: string
  description?: string
}

type CreateCategoryResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createCategory(
  input: CreateCategoryInput
): Promise<CreateCategoryResult> {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return { success: false, error: "Unauthorized" }

    const name = input.name.trim()
    const slug = input.slug.trim().toLowerCase()

    if (!name) return { success: false, error: "Category name is required." }
    if (!slug) return { success: false, error: "Category slug is required." }

    const validation = categorySchema.safeParse({
      name,
      slug,
      description: input.description?.trim(),
    })

    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message }
    }

    const id = randomUUID()

    await db.insert(category).values({
      id,
      name,
      slug,
      description: input.description?.trim() || null,
    })

    revalidatePath("/blog/categories")
    revalidatePath("/blog")

    return { success: true, id }
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
