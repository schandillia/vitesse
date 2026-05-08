"use server"

import { db } from "@/db/drizzle"
import { user, auditLog } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { ROLES } from "@/db/types/roles"
import { guardAction } from "@/lib/guard-action"
import { revalidatePath } from "next/cache"
import { siteConfig } from "@/config/site"

export async function deleteUser(userId: string) {
  const { error, user: currentUser } = await guardAction()
  if (error) return { success: false, error }

  if (currentUser.role !== ROLES.ADMIN) {
    return { success: false, error: "Unauthorized" }
  }

  if (currentUser.id === userId) {
    return {
      success: false,
      error: "You cannot delete your own account from this page.",
    }
  }

  try {
    const [targetUser] = await db
      .select({ name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, userId))

    await db.delete(user).where(eq(user.id, userId))

    const retentionMs = siteConfig.auditLogs.retentionDays * 24 * 60 * 60 * 1000

    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      userId: currentUser.id,
      event: "user_deleted",
      metadata: {
        deletedUserId: userId,
        deletedUserName: targetUser.name,
        deletedUserEmail: targetUser.email,
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + retentionMs),
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete user." }
  }
}
