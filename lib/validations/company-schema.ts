import { z } from "zod"

export const companySchema = z
  .string()
  .trim()
  .max(100, "Company name must be 100 characters or fewer")
  .regex(
    /^[a-zA-Z0-9\s\-&/().,']*$/,
    "Company name contains invalid characters"
  )
