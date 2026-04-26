export const COMMON_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jfif",
] as const

export const COMMON_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "jfif",
] as const

export type CommonMimeType = (typeof COMMON_IMAGE_MIME_TYPES)[number]
export type CommonExtension = (typeof COMMON_IMAGE_EXTENSIONS)[number]
