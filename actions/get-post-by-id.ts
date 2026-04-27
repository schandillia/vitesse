"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq } from "drizzle-orm"

export async function getPostById(id: string) {
  try {
    const result = await db.query.post.findFirst({
      where: eq(post.id, id),
    })
    return result ?? null
  } catch {
    return null
  }
}
