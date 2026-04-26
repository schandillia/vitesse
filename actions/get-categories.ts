"use server"

import { db } from "@/db/drizzle"
import { category } from "@/db/blog-schema"
import { asc } from "drizzle-orm"

export type CategoryOption = {
  id: string
  name: string
  slug: string
}

export async function getCategories(): Promise<CategoryOption[]> {
  try {
    const categories = await db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })
      .from(category)
      .orderBy(asc(category.name))

    return categories
  } catch {
    return []
  }
}
