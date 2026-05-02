import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db, schema } from "@/db/drizzle"
import { magicLink } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { sendEmail } from "@/lib/send-email"
import { renderMagicLinkEmail } from "@/emails/magic-link"
import { siteConfig } from "@/config/site"
import { nextCookies } from "better-auth/next-js"
import { renderWelcomeEmail } from "@/emails/welcome"
import { redis } from "@/lib/redis"
import { env } from "@/env"
import { auditLog, user } from "@/db/auth-schema"
import { onFailedLogin } from "@/lib/auth/hooks/failed-login"
import { MODES } from "@/lib/auth/modes"
import { eq } from "drizzle-orm"

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
      },
      preferredMode: {
        type: "string",
        required: false,
        input: true,
      },
      preferredFontSize: {
        type: "string",
        required: false,
        input: true,
      },

      username: {
        type: "string",
        required: true,
        input: true,
        unique: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  session: {
    expiresIn: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
    updateAge: siteConfig.authAndSession.updateAgeInDays * 24 * 60 * 60,
    cookieCache: {
      enabled: !siteConfig.authAndSession.logOutEverywhereInstantly,
      maxAge: siteConfig.authAndSession.cookieMaxAgeInMinutes * 60,
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
        disableIpTracking: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },

  hooks: {
    after: onFailedLogin,
  },

  // fires once per user regardless of auth method
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const prefix = user.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .slice(0, 20)

          const suffix = Math.random().toString(36).slice(2, 6)
          const username = `${prefix}_${suffix}`

          return {
            data: {
              ...user,
              username,
              name: user.name || siteConfig.users.defaultName,
            },
          }
        },
        after: async (user) => {
          const retentionMs =
            siteConfig.auditLogs.retentionDays * 24 * 60 * 60 * 1000

          const { cookies } = await import("next/headers")
          const cookieStore = await cookies()
          cookieStore.set("preferred-mode", MODES.SYSTEM, {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
          })
          cookieStore.set("preferred-font-size", "16", {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
          })

          await Promise.all([
            sendEmail({
              to: user.email,
              from: `${siteConfig.emails.welcome.sender} <${siteConfig.emails.welcome.fromEmail}>`,
              subject: `Welcome to ${siteConfig.brand.name}!`,
              body: await renderWelcomeEmail(user.name || ""),
            }),
            db.insert(auditLog).values({
              id: crypto.randomUUID(),
              userId: user.id,
              event: "signup",
              metadata: {
                email: user.email,
                name: user.name,
              },
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + retentionMs),
            }),
          ])
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          const retentionMs =
            siteConfig.auditLogs.retentionDays * 24 * 60 * 60 * 1000
          const expiresAt = new Date(Date.now() + retentionMs)

          const userData = await db
            .select({
              preferredMode: user.preferredMode,
              preferredFontSize: user.preferredFontSize,
            })
            .from(user)
            .where(eq(user.id, session.userId))
            .limit(1)

          const preferredMode = userData[0]?.preferredMode ?? MODES.SYSTEM
          const preferredFontSize = userData[0]?.preferredFontSize ?? "16"

          const { cookies } = await import("next/headers")
          const cookieStore = await cookies()
          cookieStore.set("preferred-mode", preferredMode, {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
          })
          cookieStore.set("preferred-font-size", preferredFontSize, {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: siteConfig.authAndSession.expiresInDays * 24 * 60 * 60,
          })

          await db.insert(auditLog).values({
            id: crypto.randomUUID(),
            userId: session.userId,
            event: "login",
            metadata: {
              ipAddress: session.ipAddress ?? null,
              userAgent: session.userAgent ?? null,
            },
            createdAt: new Date(),
            expiresAt,
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
          subject: `Your ${siteConfig.brand.name} login link`,
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
  // Caching layer with redis
  ...(redis && {
    secondaryStorage: {
      get: async (key) => {
        const value = await redis!.get(key)
        // Upstash parses JSON automatically, but Better-Auth expects a string back
        return value
          ? typeof value === "string"
            ? value
            : JSON.stringify(value)
          : null
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await redis!.set(key, value, { ex: ttl })
        } else {
          await redis!.set(key, value)
        }
      },
      delete: async (key) => {
        await redis!.del(key)
      },
    },
  }),
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
