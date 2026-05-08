"use server"

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"
import { env } from "@/env"
import { avatarSchema } from "@/lib/validations/avatar-schema"
import { s3Client, getPublicUrl } from "@/lib/s3"
import { guardAction } from "@/lib/guard-action"

function extractS3Key(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl)
    if (
      url.hostname.includes("cloudfront.net") ||
      url.hostname.includes("amazonaws.com")
    ) {
      return url.pathname.slice(1)
    }
    return null
  } catch {
    try {
      if (imageUrl.includes("amazonaws.com")) {
        return imageUrl.split(".com/")[1] || null
      }
      const lastSlash = imageUrl.lastIndexOf("/")
      return lastSlash !== -1 ? imageUrl.slice(lastSlash + 1) : null
    } catch {
      return null
    }
  }
}

export async function uploadAvatarAction(formData: FormData) {
  try {
    const { error, user } = await guardAction()
    if (error) return { success: false, error } as const

    const file = formData.get("file") as File | null
    if (!file) return { success: false, error: "No file provided" } as const

    const validation = avatarSchema.safeParse({ file })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid file",
      } as const
    }

    const validatedFile = validation.data.file
    const arrayBuffer = await validatedFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const extension =
      validatedFile.name.split(".").pop()?.toLowerCase() || "jpg"
    const uniqueFileName = `avatars/${randomUUID()}.${extension}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: validatedFile.type,
        CacheControl: "max-age=31536000",
      })
    )

    const oldImageUrl = user.image
    if (oldImageUrl) {
      const oldKey = extractS3Key(oldImageUrl)
      if (oldKey) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: env.AWS_S3_BUCKET_NAME!,
              Key: oldKey,
            })
          )
        } catch {
          // Silent failure - new avatar is already uploaded
        }
      }
    }

    return { success: true, url: getPublicUrl(uniqueFileName) } as const
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload image. Please try again."
    return { success: false, error: errorMessage } as const
  }
}
