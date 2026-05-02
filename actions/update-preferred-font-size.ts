"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { getServerSession } from "@/lib/auth/get-server-session"
import { FONT_SIZE_VALUES, FontSize } from "@/lib/auth/font-sizes"
import { siteConfig } from "@/config/site"

export async function updatePreferredFontSize(size: string) {
  const session = await getServerSession()
  if (!session?.user) return { success: false }

  if (
    !FONT_SIZE_VALUES.includes(
      Number(size) as (typeof FONT_SIZE_VALUES)[number]
    )
  ) {
    return { success: false }
  }

  await db
    .update(user)
    .set({ preferredFontSize: size as FontSize })
    .where(eq(user.id, session.user.id))

  const cookieStore = await cookies()
  cookieStore.set("preferred-font-size", size, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
  })

  return { success: true }
}
