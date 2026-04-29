"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { ROLES, type Role } from "@/lib/auth/roles"
import { getServerSession } from "@/lib/auth/get-server-session"
import { revalidatePath } from "next/cache"

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
    await db.update(user).set({ role: newRole }).where(eq(user.id, userId))
    revalidatePath("/admin/users")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update role." }
  }
}
