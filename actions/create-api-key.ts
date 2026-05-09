"use server"

import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { db } from "@/db/drizzle"
import { apiKey } from "@/db/api-key-schema"
import { eq, count } from "drizzle-orm"
import { API_KEY_MAX_PER_USER } from "@/config/api-keys"
import type { ApiKeyScope } from "@/config/api-keys"
import { guardAction } from "@/lib/guard-action"

type CreateApiKeyInput = {
  name: string
  expiresInDays: number | null
  scopes: ApiKeyScope[]
}

type CreateApiKeyResult =
  | { success: true; data: { key: string } }
  | { success: false; error: string }

export async function createApiKey(
  input: CreateApiKeyInput
): Promise<CreateApiKeyResult> {
  try {
    const { error, user } = await guardAction({ type: "write" })
    if (error) return { success: false, error }

    const [{ total }] = await db
      .select({ total: count() })
      .from(apiKey)
      .where(eq(apiKey.referenceId, user.id))

    if (total >= API_KEY_MAX_PER_USER) {
      return {
        success: false,
        error: `You can have at most ${API_KEY_MAX_PER_USER} API keys.`,
      }
    }

    const h = await headers()
    const expiresIn =
      input.expiresInDays !== null
        ? input.expiresInDays * 24 * 60 * 60
        : undefined

    const created = await auth.api.createApiKey({
      body: {
        name: input.name,
        expiresIn,
      },
      headers: h,
    })

    // Store unique preview in metadata since 'start' only contains the prefix
    const prefix = created.prefix ?? ""
    const uniquePart = created.key.slice(prefix.length, prefix.length + 6)
    await auth.api.updateApiKey({
      body: {
        keyId: created.id,
        metadata: { preview: `${prefix}${uniquePart}` },
        userId: user.id,
      },
      headers: h,
    })

    return { success: true, data: { key: created.key } }
  } catch (error) {
    console.error("createApiKey error:", error)
    return { success: false, error: "Failed to create API key." }
  }
}
