"use server"

import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { guardAction } from "@/lib/guard-action"

type RevokeApiKeyResult = { success: true } | { success: false; error: string }

export async function revokeApiKey(keyId: string): Promise<RevokeApiKeyResult> {
  try {
    const { error } = await guardAction({ type: "write" })
    if (error) return { success: false, error }

    const h = await headers()

    await auth.api.deleteApiKey({
      body: { keyId },
      headers: h,
    })

    return { success: true }
  } catch {
    return { success: false, error: "Failed to revoke API key." }
  }
}
