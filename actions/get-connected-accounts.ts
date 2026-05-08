"use server"

import { db } from "@/db/drizzle"
import { account } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"

export type ConnectedAccount = {
  id: string
  providerId: string
  createdAt: Date
}

type GetConnectedAccountsResult =
  | { success: true; accounts: ConnectedAccount[] }
  | { success: false; error: string }

export async function getConnectedAccounts(): Promise<GetConnectedAccountsResult> {
  try {
    const { error, user } = await guardAction({ type: "read" })
    if (error) return { success: false, error }

    const accounts = await db
      .select({
        id: account.id,
        providerId: account.providerId,
        createdAt: account.createdAt,
      })
      .from(account)
      .where(eq(account.userId, user.id))

    return { success: true, accounts }
  } catch {
    return { success: false, error: "Failed to fetch connected accounts." }
  }
}
