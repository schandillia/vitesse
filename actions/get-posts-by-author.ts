"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { user } from "@/db/auth-schema"
import { desc, eq, lt, and } from "drizzle-orm"
import { type GetPostsResult } from "@/actions/get-posts"
import { PAGE_SIZE, paginate } from "@/lib/blog-pagination"

export async function getPostsByAuthor(
  username: string,
  cursor?: string
): Promise<
  GetPostsResult & { authorName: string | null; authorBio: string | null }
> {
  try {
    const author = await db.query.user.findFirst({
      where: eq(user.username, username),
    })

    if (!author)
      return {
        posts: [],
        nextCursor: null,
        hasMore: false,
        authorName: null,
        authorBio: null,
      }

    const posts = await db.query.post.findMany({
      where: and(
        eq(post.published, true),
        eq(post.authorId, author.id),
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
      authorName: author.name,
      authorBio: author.bio ?? null,
    }
  } catch {
    return {
      posts: [],
      nextCursor: null,
      hasMore: false,
      error: true,
      authorName: null,
      authorBio: null,
    }
  }
}
