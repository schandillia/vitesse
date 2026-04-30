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

type ReturnedContext =
  | {
      status?: number
      headers?: { get: (key: string) => string | null }
      name?: string
    }
  | Error
  | null

export const onFailedLogin = createAuthMiddleware(async (ctx) => {
  const isAuthAttempt = AUTH_ENDPOINTS.some((endpoint) =>
    ctx.path.includes(endpoint)
  )

  const returned = ctx.context.returned as ReturnedContext

  const status = returned && "status" in returned ? returned.status : undefined
  const isErrorStatus = status !== undefined && status >= 400
  const isThrownError =
    returned instanceof Error ||
    (returned !== null && "name" in returned && returned.name === "APIError")

  const headers =
    returned && "headers" in returned ? returned.headers : undefined
  const locationHeader = headers?.get ? headers.get("location") : null
  const isErrorRedirect =
    status !== undefined &&
    status >= 300 &&
    status < 400 &&
    (locationHeader?.includes("error=") ||
      locationHeader?.includes("error_code="))

  const isFailure = isErrorStatus || isThrownError || isErrorRedirect

  if (!isAuthAttempt || !isFailure) return

  const body = ctx.body as Record<string, unknown> | undefined
  const attemptedEmail = body?.email as string | undefined

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
      attemptedEmail: attemptedEmail ?? "Unknown",
      ipAddress:
        ctx.headers?.get("x-forwarded-for") ||
        ctx.headers?.get("x-real-ip") ||
        null,
      userAgent: ctx.headers?.get("user-agent") || null,
      path: ctx.path,
      errorStatus: status ?? 302,
    },
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + retentionMs),
  })
})
