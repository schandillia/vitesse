import { siteConfig } from "@/config/site"
import * as z from "zod"

const MAX_USERNAME_LENGTH = siteConfig.users.maxUsernameLength
const MIN_USERNAME_LENGTH = siteConfig.users.minUsernameLength

export const usernameSchema = z
  .string()
  .min(3, `Username must be at least ${MIN_USERNAME_LENGTH} characters`)
  .max(30, `Username cannot exceed ${MAX_USERNAME_LENGTH} characters`)
  .regex(
    /^[a-z0-9_]+$/,
    "Only lowercase letters, numbers, and underscores allowed"
  )
