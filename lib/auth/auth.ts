import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/drizzle"
import * as schema from "@/db/auth-schema"
import { magicLink } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { Resend } from "resend"
import { renderMagicLinkEmail } from "@/emails/magic-link"
import { siteConfig } from "@/config/site"
import { nextCookies } from "better-auth/next-js"
import { renderWelcomeEmail } from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // fires once per user regardless of auth method
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await resend.emails.send({
            from: `${siteConfig.name} <${siteConfig.emails.noReply}>`,
            to: user.email,
            subject: `Welcome to ${siteConfig.name}!`,
            html: await renderWelcomeEmail(user.name || ""),
          })
        },
      },
    },
  },
  plugins: [
    nextCookies(),
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
