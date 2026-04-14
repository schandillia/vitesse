import { siteConfig } from "@/config/site"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailValues {
  to: string
  from?: string
  subject: string
  body: string
}

export async function sendEmail({
  to,
  from = `${siteConfig.emails.magicLink.sender} <${siteConfig.emails.magicLink.email}>`,
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
