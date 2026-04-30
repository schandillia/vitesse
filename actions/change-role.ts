"use server"

import { db } from "@/db/drizzle"
import { user, auditLog } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { ROLES, type Role } from "@/lib/auth/roles"
import { getServerSession } from "@/lib/auth/get-server-session"
import { revalidatePath } from "next/cache"
import { siteConfig } from "@/config/site"

const VALID_ROLES = Object.values(ROLES) as Role[]

export async function changeRole(userId: string, newRole: Role) {
  const session = await getServerSession()

  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return { success: false, error: "Unauthorized" }
  }

  if (session.user.id === userId) {
    return { success: false, error: "You cannot change your own role." }
  }

  if (!VALID_ROLES.includes(newRole)) {
    return { success: false, error: "Invalid role." }
  }

  try {
    const [targetUser] = await db
      .select({ role: user.role, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, userId))

    if (!targetUser) {
      return { success: false, error: "Target user not found." }
    }

    await db.update(user).set({ role: newRole }).where(eq(user.id, userId))

    const retentionMs = siteConfig.auditLogs.retentionDays * 24 * 60 * 60 * 1000

    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      event: "role_change",
      metadata: JSON.stringify({
        targetUserId: userId,
        targetUserName: targetUser.name,
        targetUserEmail: targetUser.email,
        previousRole: targetUser.role,
        newRole,
      }),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + retentionMs),
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update role." }
  }
  return { success: false, error: "Failed to update role." }
}
