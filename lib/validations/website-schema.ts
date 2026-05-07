import { z } from "zod"

export const websiteSchema = z
  .string()
  .trim()
  .max(255, "Website URL must be 255 characters or fewer")
  .refine((val) => {
    // Allow empty string (handled by component if required)
    if (!val) return true
    // Matches 'example.com', 'https://example.com', 'sub.domain.co/path'
    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(val)
  }, "Please enter a valid website URL or domain (e.g., yoursite.com)")
