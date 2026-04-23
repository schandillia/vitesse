import * as z from "zod"

// --- Category Validation ---
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name is too long"),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slugs can only contain lowercase letters, numbers, and hyphens"
    ),
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
    .max(160, "Keep it under 160 chars for Google search results"),
  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9-]+$/,
      "Slugs can only contain lowercase letters, numbers, and hyphens"
    ),
  content: z.string().min(1, "Post content cannot be empty"),
  categoryId: z.string().uuid("Please select a valid category"),
  // Optional: Add coverImage validation if they're using your S3 setup
  coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
})

// Export types for use in your React Hook Forms
export type PostInput = z.infer<typeof postSchema>
export type CategoryInput = z.infer<typeof categorySchema>
