import { createAuthMiddleware } from "better-auth/api"
import { db } from "@/db/drizzle"
import { auditLog, user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { siteConfig } from "@/config/site"

const AUTH_ENDPOINTS = [
  "/magic-link/verify",
  "/passkey/verify",
  "/sign-in/social",
  "/callback",
]

export const onFailedLogin = createAuthMiddleware(async (ctx) => {
  const isAuthAttempt = AUTH_ENDPOINTS.some((endpoint) =>
    ctx.path.includes(endpoint)
  )

  const returned = ctx.context.returned as any

  const isErrorStatus = returned?.status && returned.status >= 400
  const isThrownError =
    returned instanceof Error || returned?.name === "APIError"

  const locationHeader = returned?.headers?.get
    ? returned.headers.get("location")
    : null
  const isErrorRedirect =
    returned?.status >= 300 &&
    returned?.status < 400 &&
    (locationHeader?.includes("error=") ||
      locationHeader?.includes("error_code="))

  const isFailure = isErrorStatus || isThrownError || isErrorRedirect

  if (!isAuthAttempt || !isFailure) return

  const body = ctx.body as Record<string, any> | undefined
  const attemptedEmail = body?.email

  let targetUserId = null

  if (attemptedEmail) {
    const [targetUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, attemptedEmail))

    if (targetUser) {
      targetUserId = targetUser.id
    }
  }

  const retentionMs = siteConfig.auditLogs.retentionDays * 24 * 60 * 60 * 1000

  await db.insert(auditLog).values({
    id: crypto.randomUUID(),
    userId: targetUserId,
    event: "failed_login_attempt",
    metadata: {
      attemptedEmail: attemptedEmail || "Unknown",
      ipAddress:
        ctx.headers?.get("x-forwarded-for") ||
        ctx.headers?.get("x-real-ip") ||
        null,
      userAgent: ctx.headers?.get("user-agent") || null,
      path: ctx.path,
      errorStatus: returned?.status || 302,
    },
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + retentionMs),
  })
})
