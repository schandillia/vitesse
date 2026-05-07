import { z } from "zod"

export const socialSchema = z
  .string()
  .trim()
  .max(100, "Username/handle must be 100 characters or fewer")
  .regex(
    /^[a-zA-Z0-9_.\-@]*$/,
    "Handle contains invalid characters (spaces, special characters, and full URLs are not allowed)"
  )
