"use server"

import { db } from "@/db/drizzle"
import { user, auditLog } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { guardAction } from "@/lib/guard-action"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { siteConfig } from "@/config/site"
import { s3Client, extractS3Key } from "@/lib/s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { env } from "@/env"

export async function deleteOwnAccount(confirmationText: string) {
  const { error, user: currentUser } = await guardAction()
  if (error) return { success: false, error } as const

  if (confirmationText !== `delete ${currentUser.username}`) {
    return {
      success: false,
      error: "Confirmation text does not match.",
    } as const
  }

  try {
    const retentionMs = siteConfig.auditLogs.retentionDays * 24 * 60 * 60 * 1000

    // Silent avatar cleanup before deletion
    if (currentUser.image) {
      const key = extractS3Key(currentUser.image)
      if (key) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: env.AWS_S3_BUCKET_NAME!,
              Key: key,
            })
          )
        } catch {
          // Non-fatal — proceed with account deletion
        }
      }
    }

    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      userId: currentUser.id,
      event: "account_deleted",
      metadata: {
        email: currentUser.email,
        name: currentUser.name,
        deletedBySelf: true,
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + retentionMs),
    })

    await db.delete(user).where(eq(user.id, currentUser.id))

    await auth.api.signOut({ headers: await headers() })

    return { success: true } as const
  } catch {
    return { success: false, error: "Failed to delete account." } as const
  }
}
