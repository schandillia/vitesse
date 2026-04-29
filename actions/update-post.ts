"use server"

import { db } from "@/db/drizzle"
import { post, category } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import {
  isDuplicateKeyError,
  requireAdmin,
  resolveExcerpt,
} from "@/lib/blog-utils"
import { revalidatePath } from "next/cache"

type UpdatePostInput = {
  id: string
  title?: string
  slug?: string
  logline?: string
  content?: string
  excerpt?: string
  categoryId?: string
  coverImage?: string
  published?: boolean
}

type UpdatePostResult =
  | { success: true; slug: string }
  | { success: false; error: string }

export async function updatePost(
  input: UpdatePostInput
): Promise<UpdatePostResult> {
  try {
    const { authorized, user } = await requireAdmin()
    if (!authorized || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const existing = await db.query.post.findFirst({
      where: eq(post.id, input.id),
      columns: {
        authorId: true,
        slug: true,
        categoryId: true,
        published: true,
      },
      with: {
        author: { columns: { username: true } },
        category: { columns: { slug: true } },
      },
    })

    if (!existing || existing.authorId !== user.id) {
      return { success: false, error: "Unauthorized" }
    }

    const updates: Record<string, unknown> = {}

    if (input.title !== undefined)
      updates.title = input.title.trim() || "Untitled"
    if (input.slug !== undefined)
      updates.slug = input.slug.trim().toLowerCase() || undefined
    if (input.logline !== undefined)
      updates.logline = input.logline.trim() || null
    if (input.content !== undefined) updates.content = input.content
    if (
      input.excerpt !== undefined ||
      input.logline !== undefined ||
      input.content !== undefined
    )
      updates.excerpt = resolveExcerpt(
        input.excerpt,
        input.logline,
        input.content
      )
    if (input.coverImage !== undefined)
      updates.coverImage = input.coverImage || null
    if (input.categoryId !== undefined)
      updates.categoryId = input.categoryId || null
    if (input.published !== undefined) updates.published = input.published

    if (Object.keys(updates).length === 0) {
      return { success: true, slug: input.slug?.trim() ?? "" }
    }

    let newCategorySlug: string | null = null
    if (input.categoryId && input.categoryId !== existing.categoryId) {
      const newCategory = await db.query.category.findFirst({
        where: eq(category.id, input.categoryId),
        columns: { slug: true },
      })
      newCategorySlug = newCategory?.slug ?? null
    }

    await db.update(post).set(updates).where(eq(post.id, input.id))

    const slug =
      typeof updates.slug === "string"
        ? updates.slug
        : (input.slug?.trim() ?? "")

    const isPublished = input.published === true || existing.published === true

    if (isPublished) {
      revalidatePath("/blog")
      revalidatePath(`/blog/${slug}`)
      revalidatePath("/blog/drafts")
      if (existing.author?.username) {
        revalidatePath(`/blog/author/${existing.author.username}`)
      }
      if (existing.category?.slug) {
        revalidatePath(`/blog/category/${existing.category.slug}`)
      }
      if (newCategorySlug) {
        revalidatePath(`/blog/category/${newCategorySlug}`)
      }
    }

    return { success: true, slug }
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      return {
        success: false,
        error: "This URL slug is already taken. Please choose a different one.",
      }
    }

    const message =
      error instanceof Error
        ? "Failed to update post"
        : "An unexpected error occurred."
    return { success: false, error: message }
  }
}
