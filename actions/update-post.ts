"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import { requireAdmin, resolveExcerpt } from "@/lib/blog-utils"

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
    const { authorized } = await requireAdmin()
    if (!authorized) return { success: false, error: "Unauthorized" }

    const updates: Record<string, unknown> = {}

    if (input.title !== undefined)
      updates.title = input.title.trim() || "Untitled"
    if (input.slug !== undefined) updates.slug = input.slug.trim() || undefined
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

    await db.update(post).set(updates).where(eq(post.id, input.id))

    const slug = input.slug?.trim() ?? ""
    return { success: true, slug }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update post"
    return { success: false, error: message }
  }
}
