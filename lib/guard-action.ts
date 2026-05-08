import { getServerSession } from "@/lib/auth/get-server-session"
import { ajAuth } from "@/lib/arcjet"
import { slidingWindow } from "@arcjet/next"
import { request } from "@arcjet/next"
import { env } from "@/env"
import { siteConfig } from "@/config/site"

const { read, write, autosave } =
  siteConfig.security.arcjet.rateLimits.serverActions

export async function guardAction(options?: {
  type?: "read" | "write" | "autosave"
  max?: number
  interval?: number
}) {
  const session = await getServerSession()
  if (!session?.user)
    return {
      error: "Unauthorized" as const,
      code: "UNAUTHORIZED" as const,
      user: null,
    }

  if (env.ARCJET_KEY) {
    const defaults =
      options?.type === "read"
        ? read
        : options?.type === "autosave"
          ? autosave
          : write

    const req = await request()
    const decision = await ajAuth
      .withRule(
        slidingWindow({
          mode: "LIVE",
          interval: options?.interval ?? defaults.interval,
          max: options?.max ?? defaults.max,
        })
      )
      .protect(req, { userIdOrIp: session.user.id })

    if (decision.isDenied()) {
      return {
        error: "Too many requests. Please slow down!" as const,
        code: "RATE_LIMITED" as const,
        user: null,
      }
    }
  }

  return { error: null, user: session.user }
}
