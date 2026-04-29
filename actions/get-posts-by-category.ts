"use server"

import { db } from "@/db/drizzle"
import { post, category } from "@/db/blog-schema"
import { desc, eq, lt, and } from "drizzle-orm"
import { type GetPostsResult } from "@/actions/get-posts"
import { PAGE_SIZE, paginate } from "@/lib/blog-pagination"

export async function getPostsByCategory(
  categorySlug: string,
  cursor?: string
): Promise<
  GetPostsResult & {
    categoryName: string | null
    categoryDescription: string | null
  }
> {
  try {
    const found = await db.query.category.findFirst({
      where: eq(category.slug, categorySlug),
    })

    if (!found)
      return {
        posts: [],
        nextCursor: null,
        hasMore: false,
        categoryName: null,
        categoryDescription: null,
      }
    const posts = await db.query.post.findMany({
      where: and(
        eq(post.published, true),
        eq(post.categoryId, found.id),
        cursor ? lt(post.createdAt, new Date(cursor)) : undefined
      ),
      orderBy: [desc(post.createdAt)],
      limit: PAGE_SIZE + 1,
      with: { category: true, author: true },
    })

    const { trimmed, hasMore, nextCursor } = paginate(posts)
    return {
      posts: trimmed,
      nextCursor,
      hasMore,
      categoryName: found.name,
      categoryDescription: found.description ?? null,
    }
  } catch {
    return {
      posts: [],
      nextCursor: null,
      hasMore: false,
      error: true,
      categoryName: null,
      categoryDescription: null,
    }
  }
}
