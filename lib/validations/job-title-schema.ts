import { z } from "zod"

export const jobTitleSchema = z
  .string()
  .trim()
  .max(100, "Job title must be 100 characters or fewer")
  .regex(/^[a-zA-Z0-9\s\-&/().,']*$/, "Job title contains invalid characters")
