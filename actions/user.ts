"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { unknown } from "better-auth"

/**
 * Updates a user's name in the database.
 * * @param userId - The unique ID of the user to update
 * @param name - The new name to persist
 */
export async function updateUserName(userId: string, name: string) {
  try {
    // 1. Perform the update
    // The .returning() is optional but useful if you want to log the result
    await db.update(user).set({ name }).where(eq(user.id, userId))

    // 2. Purge the cache for the profile page
    // This tells Next.js to fetch fresh data for any component using this user data
    revalidatePath("/profile")

    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: "Internal Server Error" }
  }
}
