import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// Export the inferred type so you can use it anywhere without redefining it
export type ContactFormValues = z.infer<typeof contactFormSchema>
