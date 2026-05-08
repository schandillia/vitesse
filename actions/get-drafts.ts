"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq, and } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"
import { ROLES } from "@/db/types/roles"

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
  | { success: false; error: string; code?: "RATE_LIMITED" | "UNAUTHORIZED" }

export async function getDrafts(): Promise<GetDraftsResult> {
  try {
    const { error, code, user } = await guardAction({ type: "read" })
    if (error) return { success: false, error, code }

    if (user.role !== ROLES.ADMIN) {
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
