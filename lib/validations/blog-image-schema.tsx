import { z } from "zod"
import { siteConfig } from "@/config/site"
import {
  COMMON_IMAGE_MIME_TYPES,
  COMMON_IMAGE_EXTENSIONS,
} from "@/lib/validations/image-validation"

const MAX_SIZE_BYTES = siteConfig.uploads.blogImageSizeLimitInMB * 1024 * 1024

const ACCEPTED_MIME_TYPES = [
  ...COMMON_IMAGE_MIME_TYPES,
  "image/gif",
  "image/avif",
] as const

const ACCEPTED_EXTENSIONS = [...COMMON_IMAGE_EXTENSIONS, "gif", "avif"] as const

type AllowedMimeType = (typeof ACCEPTED_MIME_TYPES)[number]
type AllowedExtension = (typeof ACCEPTED_EXTENSIONS)[number]

export const blogImageSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .superRefine((file, ctx) => {
      if (file.size > MAX_SIZE_BYTES) {
        ctx.addIssue({
          code: "custom",
          message: `Image must be smaller than ${siteConfig.uploads.blogImageSizeLimitInMB}MB`,
        })
        return
      }

      if (!ACCEPTED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG, PNG, WebP, GIF, and AVIF images are allowed",
        })
        return
      }

      const extension = file.name.split(".").pop()?.toLowerCase()
      if (
        !extension ||
        !ACCEPTED_EXTENSIONS.includes(extension as AllowedExtension)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG, PNG, WebP, GIF, and AVIF images are allowed",
        })
      }
    }),
})

export type BlogImageFormData = z.infer<typeof blogImageSchema>
