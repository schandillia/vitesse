"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { ROLES } from "@/lib/auth/roles"
import { getServerSession } from "@/lib/auth/get-server-session"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
  const session = await getServerSession()

  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return { success: false, error: "Unauthorized" }
  }

  if (session.user.id === userId) {
    return { success: false, error: "You cannot delete your own account." }
  }

  try {
    await db.delete(user).where(eq(user.id, userId))
    revalidatePath("/admin/users")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete user." }
  }
}
