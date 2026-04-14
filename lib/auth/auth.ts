import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/drizzle"
import * as schema from "@/db/auth-schema"
import { magicLink } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { sendEmail } from "@/lib/send-email"
import { renderMagicLinkEmail } from "@/emails/magic-link"
import { siteConfig } from "@/config/site"
import { nextCookies } from "better-auth/next-js"
import { renderWelcomeEmail } from "@/emails/welcome"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
      },
    },
  },
  session: {
    expiresIn: siteConfig.expiresInDays * 24 * 60 * 60,
    updateAge: siteConfig.updateAgeInDays * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: siteConfig.cookieMaxAgeInMinutes * 60,
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
          await sendEmail({
            to: user.email,
            from: `${siteConfig.emails.welcome.sender} <${siteConfig.emails.welcome.email}>`,
            subject: `Welcome to ${siteConfig.name}!`,
            body: await renderWelcomeEmail(user.name || ""),
          })
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: `Your ${siteConfig.name} login link`,
          body: await renderMagicLinkEmail(url),
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

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
