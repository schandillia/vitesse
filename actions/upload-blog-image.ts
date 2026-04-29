"use server"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getPublicUrl, s3Client } from "@/lib/s3"
import { auth } from "@/lib/auth/auth"
import { randomUUID } from "crypto"
import { headers } from "next/headers"
import { env } from "@/env"

export async function uploadBlogImageAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { success: false, error: "Unauthorized" } as const
    }

    const file = formData.get("file") as File | null
    if (!file) {
      return { success: false, error: "No file provided" } as const
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" } as const
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "Image must be under 10MB" } as const
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const uniqueFileName = `blog-images/${randomUUID()}.${extension}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "max-age=31536000",
      })
    )

    const publicUrl = getPublicUrl(uniqueFileName)

    return { success: true, url: publicUrl } as const
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload image"
    return { success: false, error: errorMessage } as const
  }
}
