"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/blog-utils"
import { revalidatePath } from "next/cache"

type DeletePostResult = { success: true } | { success: false; error: string }

export async function deletePostAction(
  postId: string
): Promise<DeletePostResult> {
  try {
    const { authorized, user } = await requireAdmin()

    if (!authorized || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const existing = await db.query.post.findFirst({
      where: eq(post.id, postId),
      columns: {
        id: true,
        authorId: true,
        slug: true,
        published: true,
      },
      with: {
        author: { columns: { username: true } },
        category: { columns: { slug: true } },
      },
    })

    if (!existing) {
      return { success: false, error: "Post not found" }
    }

    if (existing.authorId !== user.id) {
      return { success: false, error: "Forbidden" }
    }

    await db.delete(post).where(eq(post.id, postId))

    revalidatePath("/blog/drafts")

    if (existing.published) {
      revalidatePath("/blog")
      revalidatePath(`/blog/${existing.slug}`)
      if (existing.author?.username) {
        revalidatePath(`/blog/author/${existing.author.username}`)
      }
      if (existing.category?.slug) {
        revalidatePath(`/blog/category/${existing.category.slug}`)
      }
    }

    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post"

    return { success: false, error: message }
  }
}
