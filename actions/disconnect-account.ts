"use server"

import { db } from "@/db/drizzle"
import { account } from "@/db/auth-schema"
import { eq, and } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"
import { revalidatePath } from "next/cache"

export async function disconnectAccount(accountId: string) {
  const { error, user } = await guardAction()
  if (error) return { success: false, error } as const

  try {
    const allAccounts = await db
      .select({ id: account.id })
      .from(account)
      .where(eq(account.userId, user.id))

    if (allAccounts.length <= 1) {
      return {
        success: false,
        error: "You cannot disconnect your only sign-in method.",
      } as const
    }

    await db
      .delete(account)
      .where(and(eq(account.id, accountId), eq(account.userId, user.id)))

    revalidatePath("/settings/account")
    return { success: true } as const
  } catch {
    return { success: false, error: "Failed to disconnect account." } as const
  }
}
