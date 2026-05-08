"use server"

import { db } from "@/db/drizzle"
import { user, account, passkey, auditLog } from "@/db/auth-schema"
import { post } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"

export async function exportUserData() {
  const { error, user: currentUser } = await guardAction()
  if (error) return { success: false, error } as const

  try {
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1)

    const accounts = await db
      .select({
        providerId: account.providerId,
        createdAt: account.createdAt,
      })
      .from(account)
      .where(eq(account.userId, currentUser.id))

    const passkeys = await db
      .select({
        name: passkey.name,
        deviceType: passkey.deviceType,
        createdAt: passkey.createdAt,
        backedUp: passkey.backedUp,
      })
      .from(passkey)
      .where(eq(passkey.userId, currentUser.id))

    const posts = await db
      .select({
        title: post.title,
        slug: post.slug,
        content: post.content,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
      .from(post)
      .where(eq(post.authorId, currentUser.id))

    const auditLogs = await db
      .select({
        event: auditLog.event,
        metadata: auditLog.metadata,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .where(eq(auditLog.userId, currentUser.id))

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        bio: userData.bio,
        image: userData.image,
        website: userData.website,
        location: userData.location,
        socials: userData.socials,
        jobTitle: userData.jobTitle,
        company: userData.company,
        dateOfBirth: userData.dateOfBirth,
        locale: userData.locale,
        createdAt: userData.createdAt,
      },
      preferences: {
        preferredMode: userData.preferredMode,
        preferredFontSize: userData.preferredFontSize,
        reduceMotion: userData.reduceMotion,
        notificationPreferences: userData.notificationPreferences,
      },
      connectedAccounts: accounts,
      passkeys,
      posts,
      auditLogs,
    }

    return { success: true, data: JSON.stringify(exportData, null, 2) } as const
  } catch {
    return { success: false, error: "Failed to export data." } as const
  }
}
