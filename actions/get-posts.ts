"use server"

import { db } from "@/db/drizzle"
import { post, category } from "@/db/blog-schema"
import { user } from "@/db/auth-schema"
import { desc, eq, lt, and, type InferSelectModel } from "drizzle-orm"
import { PAGE_SIZE, paginate } from "@/lib/blog-pagination"

export type Post = InferSelectModel<typeof post>
export type Category = InferSelectModel<typeof category>
export type User = InferSelectModel<typeof user>

export type PostWithRelations = Post & {
  author: User
  category: Category | null
}

export type GetPostsResult = {
  posts: PostWithRelations[]
  nextCursor: string | null
  hasMore: boolean
  error?: boolean
}

export async function getPosts(cursor?: string): Promise<GetPostsResult> {
  try {
    const posts = await db.query.post.findMany({
      where: and(
        eq(post.published, true),
        cursor ? lt(post.createdAt, new Date(cursor)) : undefined
      ),
      orderBy: [desc(post.createdAt)],
      limit: PAGE_SIZE + 1,
      with: {
        category: true,
        author: true,
      },
    })

    const { trimmed, hasMore, nextCursor } = paginate(posts)
    return { posts: trimmed, nextCursor, hasMore }
  } catch {
    return { posts: [], nextCursor: null, hasMore: false, error: true }
  }
}
