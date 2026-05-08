"use server"

import { db } from "@/db/drizzle"
import { post, category } from "@/db/blog-schema"
import { randomUUID } from "crypto"
import { isDuplicateKeyError, resolveExcerpt } from "@/lib/blog-utils"
import { guardAction } from "@/lib/guard-action"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { ROLES } from "@/db/types/roles"

type CreatePostInput = {
  title?: string
  slug?: string
  logline?: string
  content?: string
  excerpt?: string
  categoryId?: string
  coverImage?: string
  published?: boolean
}

type CreatePostResult =
  | { success: true; id: string; slug: string }
  | { success: false; error: string }

export async function createPost(
  input: CreatePostInput
): Promise<CreatePostResult> {
  try {
    const { error, user } = await guardAction()
    if (error) return { success: false, error }

    if (user.role !== ROLES.ADMIN) {
      return { success: false, error: "Unauthorized" }
    }

    const id = randomUUID()
    const slug = input.slug?.trim() || `draft-${randomUUID().slice(0, 8)}`
    const title = input.title?.trim() || "Untitled"

    await db.insert(post).values({
      id,
      title,
      logline: input.logline?.trim() || null,
      slug,
      content: input.content?.trim() || "",
      excerpt: resolveExcerpt(input.excerpt, input.logline, input.content),
      coverImage: input.coverImage || null,
      categoryId: input.categoryId || null,
      authorId: user.id,
      published: input.published ?? false,
    })

    if (input.published) {
      revalidatePath("/blog")
      revalidatePath(`/blog/${slug}`)
      revalidatePath(`/blog/author/${user.username}`)
      if (input.categoryId) {
        const newCategory = await db.query.category.findFirst({
          where: eq(category.id, input.categoryId),
          columns: { slug: true },
        })
        if (newCategory?.slug) {
          revalidatePath(`/blog/category/${newCategory.slug}`)
        }
      }
    }

    return { success: true, id, slug }
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      return {
        success: false,
        error: "This URL slug is already taken. Please choose a different one.",
      }
    }

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: message }
  }
}
