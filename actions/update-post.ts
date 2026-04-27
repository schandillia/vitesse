"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { ROLES } from "@/lib/auth/roles"
import { eq } from "drizzle-orm"

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
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== ROLES.ADMIN) {
      return { success: false, error: "Unauthorized" }
    }

    const updates: Record<string, unknown> = {}

    if (input.title !== undefined)
      updates.title = input.title.trim() || "Untitled"
    if (input.slug !== undefined) updates.slug = input.slug.trim() || undefined
    if (input.logline !== undefined)
      updates.logline = input.logline.trim() || null
    if (input.content !== undefined) updates.content = input.content
    if (input.excerpt !== undefined)
      updates.excerpt = input.excerpt.trim() || null
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
