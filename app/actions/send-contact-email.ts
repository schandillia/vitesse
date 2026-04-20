"use server"

import { headers } from "next/headers"
import { sendEmail } from "@/lib/send-email"
import { siteConfig } from "@/config/site"
import { protectSignup } from "@arcjet/next"
import { contactFormSchema } from "@/lib/validations/contact"
import { aj, getArcjetErrorMessage } from "@/lib/arcjet"
import { renderContactNotificationEmail } from "@/emails/contact-notification"
import { renderContactAutoReplyEmail } from "@/emails/contact-auto-reply"

export async function sendContactEmailAction(values: unknown) {
  try {
    // 1. Validate on the server independently of the client
    const parsed = contactFormSchema.safeParse(values)
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
      }
    }

    const { name, email, subject, message } = parsed.data

    // 2. Arcjet protection
    if (siteConfig.security.arcjet.enabled) {
      const headersList = await headers()
      const decision = await aj
        .withRule(
          protectSignup({
            email: {
              mode: "LIVE",
              deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
            },
            bots: { mode: "LIVE", allow: [] },
            rateLimit: {
              mode: "LIVE",
              max: siteConfig.security.arcjet.rateLimits.contact.max,
              interval: siteConfig.security.arcjet.rateLimits.contact
                .interval as string,
            },
          })
        )
        .protect({ headers: headersList }, { email })

      if (decision.isDenied()) {
        return {
          success: false,
          error: getArcjetErrorMessage(decision),
        }
      }
    }

    const senderIdentity = `${siteConfig.emails.contact.sender} <${siteConfig.emails.contact.fromEmail}>`

    const notificationHtml = await renderContactNotificationEmail(
      name,
      email,
      message
    )
    const autoReplyHtml = await renderContactAutoReplyEmail(name, message)

    await Promise.all([
      sendEmail({
        to: siteConfig.emails.contact.toEmail,
        from: senderIdentity,
        subject: `[Contact] ${subject}`,
        body: notificationHtml,
      }),
      sendEmail({
        to: email,
        from: senderIdentity,
        subject: `We received your message`,
        body: autoReplyHtml,
      }),
    ])

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Specific error:", error.message)
    } else {
      // Handle weird edge cases (like a 3rd party package throwing a string)
      console.error("Unknown error caught:", error)
    }

    return {
      success: false,
      error: "Failed to send message. Please try again.",
    }
  }
}
