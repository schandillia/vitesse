import { z } from "zod"
import { siteConfig } from "@/config/site"
import {
  COMMON_IMAGE_MIME_TYPES,
  COMMON_IMAGE_EXTENSIONS,
  type CommonMimeType,
  type CommonExtension,
} from "@/lib/validations/image-validation"

const MAX_SIZE_BYTES = siteConfig.uploads.avatarSizeLimitInMB * 1024 * 1024

export const avatarSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .superRefine((file, ctx) => {
      if (file.size > MAX_SIZE_BYTES) {
        ctx.addIssue({
          code: "custom",
          message: `Image must be smaller than ${siteConfig.uploads.avatarSizeLimitInMB}MB`,
        })
        return
      }

      if (!COMMON_IMAGE_MIME_TYPES.includes(file.type as CommonMimeType)) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG, PNG, and WebP images are allowed",
        })
        return
      }

      const extension = file.name.split(".").pop()?.toLowerCase()
      if (
        !extension ||
        !COMMON_IMAGE_EXTENSIONS.includes(extension as CommonExtension)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG, PNG, and WebP images are allowed",
        })
      }
    }),
})

export type AvatarFormData = z.infer<typeof avatarSchema>
