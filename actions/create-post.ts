"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { ROLES } from "@/lib/auth/roles"
import { randomUUID } from "crypto"

type CreatePostInput = {
  title: string
  slug: string
  logline?: string
  content: string
  excerpt?: string
  categoryId?: string
  coverImage?: string
  published?: boolean
}

type CreatePostResult =
  | { success: true; slug: string }
  | { success: false; error: string }

export async function createPost(
  input: CreatePostInput
): Promise<CreatePostResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== ROLES.ADMIN) {
      return { success: false, error: "Unauthorized" }
    }

    if (!input.title.trim()) {
      return { success: false, error: "Title is required" }
    }

    if (!input.slug.trim()) {
      return { success: false, error: "Slug is required" }
    }

    if (!input.content.trim()) {
      return { success: false, error: "Content is required" }
    }

    await db.insert(post).values({
      id: randomUUID(),
      title: input.title.trim(),
      logline: input.logline?.trim() || null,
      slug: input.slug.trim(),
      content: input.content,
      excerpt: input.excerpt?.trim() || null,
      coverImage: input.coverImage || null,
      categoryId: input.categoryId || null,
      authorId: session.user.id,
      published: input.published ?? false,
    })

    return { success: true, slug: input.slug.trim() }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create post"
    return { success: false, error: message }
  }
}
