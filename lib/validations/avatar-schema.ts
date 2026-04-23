import { z } from "zod"
import { siteConfig } from "@/config/site"

const MAX_SIZE_BYTES = siteConfig.uploads.avatarSizeLimitInMB * 1024 * 1024

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jfif",
] as const

const ACCEPTED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "jfif"] as const

export const avatarSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .superRefine((file, ctx) => {
      // Size validation
      if (file.size > MAX_SIZE_BYTES) {
        ctx.addIssue({
          code: "custom", // ← Fixed: use string "custom"
          message: `Image must be smaller than ${siteConfig.uploads.avatarSizeLimitInMB}MB`,
        })
        return
      }

      // MIME Type validation
      if (!ACCEPTED_MIME_TYPES.includes(file.type as any)) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG, PNG, and WebP images are allowed",
        })
        return
      }

      // Extension validation
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (!extension || !ACCEPTED_EXTENSIONS.includes(extension as any)) {
        ctx.addIssue({
          code: "custom",
          message: "Only JPG, PNG, and WebP images are allowed",
        })
      }
    }),
})

export type AvatarFormData = z.infer<typeof avatarSchema>
