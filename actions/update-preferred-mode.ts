"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { getServerSession } from "@/lib/auth/get-server-session"
import { MODES, type Mode } from "@/lib/auth/modes"
import { siteConfig } from "@/config/site"

export async function updatePreferredMode(mode: Mode) {
  const session = await getServerSession()
  if (!session?.user) return { success: false }

  const validModes = [MODES.LIGHT, MODES.DARK, MODES.SYSTEM]
  if (!validModes.includes(mode)) return { success: false }

  await db
    .update(user)
    .set({ preferredMode: mode })
    .where(eq(user.id, session.user.id))

  const cookieStore = await cookies()
  cookieStore.set("preferred-mode", mode, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
  })

  return { success: true }
}
