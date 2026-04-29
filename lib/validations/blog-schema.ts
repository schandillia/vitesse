import * as z from "zod"

// --- Shared primitives ---
const slugBase = z
  .string()
  .regex(
    /^[a-z0-9-]+$/,
    "Slugs can only contain lowercase letters, numbers, and hyphens"
  )

// --- Category Validation ---
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name is too long")
    .regex(
      /^[a-zA-Z0-9\s\-'&]+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, apostrophes, and ampersands"
    ),
  slug: slugBase
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug is too long"),
  description: z
    .string()
    .max(200, "Description should be a brief overview")
    .optional(),
})

// --- Post Validation ---
export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title is too long for display"),
  logline: z.string().max(200, "Keep your logline short and punchy").optional(),
  excerpt: z
    .string()
    .min(10, "SEO description is too short")
    .max(200, "Keep it under 200 chars for Google search results"),
  slug: slugBase
    .min(2, "Slug must be at least 2 characters")
    .max(75, "Slug is too long"),
  content: z.string().min(1, "Post content cannot be empty"),
  categoryId: z.string().uuid("Please select a valid category"),
  coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
})

// Export types for use in your React Hook Forms
export type PostInput = z.infer<typeof postSchema>
export type CategoryInput = z.infer<typeof categorySchema>
