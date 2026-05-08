"use server"

import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { guardAction } from "@/lib/guard-action"

export type SessionItem = {
  id: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  expiresAt: Date
  token: string
}

type GetSessionsResult =
  | { success: true; sessions: SessionItem[]; currentToken: string }
  | { success: false; error: string }

export async function getSessions(): Promise<GetSessionsResult> {
  try {
    const { error } = await guardAction({ type: "read" })
    if (error) return { success: false, error }

    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    const sessions = await auth.api.listSessions({ headers: h })

    return {
      success: true,
      sessions: sessions.map((s) => ({
        id: s.id,
        ipAddress: s.ipAddress ?? null,
        userAgent: s.userAgent ?? null,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        token: s.token,
      })),
      currentToken: session!.session.token,
    }
  } catch {
    return { success: false, error: "Failed to fetch sessions." }
  }
}
