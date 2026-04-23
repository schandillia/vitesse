"use server"

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { auth } from "@/lib/auth/auth"
import { randomUUID } from "crypto"
import { headers } from "next/headers"
import { env } from "@/env"
import { avatarSchema } from "@/lib/validations/avatar-schema"

const s3Client = new S3Client({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
})

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
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const file = formData.get("file") as File | null
    if (!file) {
      throw new Error("No file provided")
    }

    // Zod Validation
    const validation = avatarSchema.safeParse({ file })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid file",
      } as const
    }

    const validatedFile = validation.data.file

    // Upload preparation
    const arrayBuffer = await validatedFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extension =
      validatedFile.name.split(".").pop()?.toLowerCase() || "jpg"
    const uniqueFileName = `avatars/${randomUUID()}.${extension}`

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: validatedFile.type,
        CacheControl: "max-age=31536000",
      })
    )

    // Generate public URL
    const cdnBase = env.NEXT_PUBLIC_CLOUDFRONT_URL
    const publicUrl = cdnBase
      ? `${cdnBase}/${uniqueFileName}`
      : `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    // Silent cleanup of old avatar
    const oldImageUrl = session.user.image
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

    return {
      success: true,
      url: publicUrl,
    } as const
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload image. Please try again."

    return {
      success: false,
      error: errorMessage,
    } as const
  }
}
