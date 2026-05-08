"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { guardAction } from "@/lib/guard-action"
import { siteConfig } from "@/config/site"

export async function updateReduceMotion(reduceMotion: boolean) {
  const { error, user: currentUser } = await guardAction()
  if (error) return { success: false }

  await db.update(user).set({ reduceMotion }).where(eq(user.id, currentUser.id))

  const cookieStore = await cookies()
  cookieStore.set("reduce-motion", String(reduceMotion), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
  })

  return { success: true }
}
