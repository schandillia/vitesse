import { siteConfig } from "@/config/site"
import { env } from "@/env"
import { Resend } from "resend"

const resend = new Resend(env.RESEND_API_KEY)

interface SendEmailValues {
  to: string
  from?: string
  subject: string
  body: string
}

export async function sendEmail({
  to,
  from = `${siteConfig.emails.magicLink.sender} <${siteConfig.emails.magicLink.fromEmail}>`,
  subject,
  body,
}: SendEmailValues) {
  await resend.emails.send({
    from,
    to,
    subject,
    html: body,
  })
}
