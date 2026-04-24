"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq, and } from "drizzle-orm"
import { type PostWithRelations } from "./get-posts"

/**
 * Fetches a single published blog post by its slug,
 * including author and category details.
 */
export async function getPostBySlug(
  slug: string
): Promise<PostWithRelations | null> {
  try {
    const result = await db.query.post.findFirst({
      where: and(eq(post.slug, slug), eq(post.published, true)),
      with: {
        category: true,
        author: true,
      },
    })

    return result ?? null
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}
