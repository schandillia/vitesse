import { siteConfig } from "@/config/site"
import * as z from "zod"

const MAX_BIO_LENGTH = siteConfig.users.maxBioLength
const MIN_BIO_LENGTH = siteConfig.users.minBioLength

export const bioSchema = z
  .string()
  .trim()
  .max(MAX_BIO_LENGTH, `Bio cannot exceed ${MAX_BIO_LENGTH} characters`)
  .refine(
    (val) => val.length === 0 || val.length >= MIN_BIO_LENGTH,
    `Bio must be at least ${MIN_BIO_LENGTH} characters long if provided`
  )
  .refine((val) => !/https?:\/\/|www\./i.test(val), "Bio cannot contain URLs")
