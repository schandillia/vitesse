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

const s3Client = new S3Client({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function uploadAvatarAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session || !session.user) {
      throw new Error("Unauthorized")
    }

    const file = formData.get("file") as File
    if (!file) throw new Error("No file provided")

    // 1. Identify the current avatar (to be deleted later)
    const oldImageUrl = session.user.image

    // 2. Prepare the new upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const extension = file.name.split(".").pop()
    const uniqueFileName = `avatars/${randomUUID()}.${extension}`

    // 3. Upload the NEW file
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "max-age=31536000",
      })
    )

    const publicUrl = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${uniqueFileName}`

    // 4. CLEANUP: Delete the old file from S3
    // We do this AFTER the new upload succeeds to ensure the user isn't left empty-handed
    if (oldImageUrl && oldImageUrl.includes("amazonaws.com")) {
      try {
        const oldKey = oldImageUrl.split(".com/")[1]
        if (oldKey) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: env.AWS_S3_BUCKET_NAME!,
              Key: oldKey,
            })
          )
        }
      } catch (deleteError) {
        // Log it, but don't fail the action. We already have the new URL!
        console.error(
          "Non-critical: Failed to delete old S3 object",
          deleteError
        )
      }
    }

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("S3 Upload Error:", error)
    return { success: false, error: "Failed to upload image" }
  }
}
