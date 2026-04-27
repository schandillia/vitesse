"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { randomUUID } from "crypto"
import { requireAdmin, resolveExcerpt } from "@/lib/blog-utils"

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
    const { authorized, user } = await requireAdmin()
    if (!authorized) return { success: false, error: "Unauthorized" }

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
      authorId: user!.id,
      published: input.published ?? false,
    })

    return { success: true, id, slug }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create post"
    return { success: false, error: message }
  }
}
