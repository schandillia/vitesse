import { S3Client } from "@aws-sdk/client-s3"
import { env } from "@/env"

export const s3Client = new S3Client({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
})

export function getPublicUrl(key: string): string {
  const cdnBase = env.NEXT_PUBLIC_CLOUDFRONT_URL
  return cdnBase
    ? `${cdnBase}/${key}`
    : `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
}

export function extractS3Key(imageUrl: string): string | null {
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
