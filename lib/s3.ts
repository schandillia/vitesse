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
