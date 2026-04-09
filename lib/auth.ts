import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/drizzle" // your drizzle instance
import * as schema from "@/db/auth-schema"
import { magicLink } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { Resend } from "resend"
import { renderMagicLinkEmail } from "@/emails/magic-link"
import { siteConfig } from "@/config/site"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: `${siteConfig.name} <${siteConfig.emails.noReply}>`,
          to: email,
          subject: `Your ${siteConfig.name} login link`,
          html: await renderMagicLinkEmail(url),
        })
      },
    }),
    passkey(),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
})
