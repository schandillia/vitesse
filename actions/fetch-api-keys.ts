"use server"

import { db } from "@/db/drizzle"
import { apiKey } from "@/db/api-key-schema"
import { eq } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"

export type ApiKeyItem = {
  id: string
  name: string | null
  start: string | null
  prefix: string | null
  permissions: string | null
  metadata: string | null
  expiresAt: Date | null
  createdAt: Date
  lastRequest: Date | null
  requestCount: number | null
  enabled: boolean | null
}

type FetchApiKeysResult =
  | { success: true; data: ApiKeyItem[] }
  | { success: false; error: string }

export async function fetchApiKeys(): Promise<FetchApiKeysResult> {
  try {
    const { error, user } = await guardAction({ type: "read" })
    if (error) return { success: false, error }

    const keys = await db
      .select({
        id: apiKey.id,
        name: apiKey.name,
        start: apiKey.start,
        prefix: apiKey.prefix,
        permissions: apiKey.permissions,
        metadata: apiKey.metadata,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
        lastRequest: apiKey.lastRequest,
        requestCount: apiKey.requestCount,
        enabled: apiKey.enabled,
      })
      .from(apiKey)
      .where(eq(apiKey.referenceId, user.id))

    return { success: true, data: keys }
  } catch {
    return { success: false, error: "Failed to fetch API keys." }
  }
}
