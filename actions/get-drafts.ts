"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq, and } from "drizzle-orm"
import { requireAdmin } from "@/lib/blog-utils"

export type DraftPost = {
  id: string
  title: string
  slug: string
  logline: string | null
  excerpt: string | null
  coverImage: string | null
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
}

type GetDraftsResult =
  | { success: true; drafts: DraftPost[] }
  | { success: false; error: string }

export async function getDrafts(): Promise<GetDraftsResult> {
  try {
    const { authorized, user } = await requireAdmin()

    if (!authorized || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const drafts = await db.query.post.findMany({
      where: and(eq(post.authorId, user.id), eq(post.published, false)),
      columns: {
        id: true,
        title: true,
        slug: true,
        logline: true,
        excerpt: true,
        coverImage: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (post, { desc }) => [desc(post.updatedAt)],
    })

    return { success: true, drafts }
  } catch {
    return { success: false, error: "Failed to fetch drafts." }
  }
}
