import { siteConfig } from "@/config/site"
import * as z from "zod"

const MAX_NAME_LENGTH = siteConfig.users.maxNameLength
const MIN_NAME_LENGTH = siteConfig.users.minNameLength

export const nameSchema = z
  .string()
  .trim()
  .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
  .max(MAX_NAME_LENGTH, `Name cannot exceed ${MAX_NAME_LENGTH} characters`)
  .regex(
    // \p{L} = Any letter in any language
    // \s = Spaces
    // \-'\., = Hyphens, apostrophes, periods, commas
    // /u = Required flag to turn on Unicode support
    /^[\p{L}\s\-'’\.,]+$/u,
    "Name can only contain letters, spaces, and basic punctuation"
  )
