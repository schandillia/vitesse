export const runtime = "nodejs"

import { siteConfig } from "@/config/site"
import { auth } from "@/lib/auth/auth"
import { toNextJsHandler } from "better-auth/next-js"
import {
  BotOptions,
  EmailOptions,
  SlidingWindowRateLimitOptions,
  protectSignup,
  detectBot,
  slidingWindow,
} from "@arcjet/next"
import { findIp } from "@arcjet/ip"
import { ajAuth, getArcjetErrorMessage } from "@/lib/arcjet"

const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions
const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: siteConfig.security.arcjet.rateLimits.authRestrictive.max,
  interval: siteConfig.security.arcjet.rateLimits.authRestrictive.interval,
} as SlidingWindowRateLimitOptions<[]>
const laxRateLimitSettings = {
  mode: "LIVE",
  max: siteConfig.security.arcjet.rateLimits.authLax.max,
  interval: siteConfig.security.arcjet.rateLimits.authLax.interval,
} as SlidingWindowRateLimitOptions<[]>
const emailSettings = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions

const authHandlers = toNextJsHandler(auth)

export const { GET } = authHandlers

export async function POST(request: Request) {
  if (!siteConfig.security.arcjet.enabled) {
    return authHandlers.POST(request)
  }

  const clonedRequest = request.clone()
  const decision = await checkArcjet(request)

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return Response.json(
        { message: "Too many attempts. Please try after some time." },
        { status: 429 }
      )
    } else if (decision.reason.isEmail()) {
      return Response.json(
        { message: getArcjetErrorMessage(decision) },
        { status: 400 }
      )
    } else {
      return new Response(null, { status: 403 })
    }
  }
  return authHandlers.POST(clonedRequest)
}

async function checkArcjet(request: Request) {
  let body: unknown = null
  try {
    body = await request.json()
  } catch {
    // not all auth requests have a JSON body — that's fine
  }

  const session = await auth.api.getSession({ headers: request.headers })
  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1"

  if (new URL(request.url).pathname === "/api/auth/sign-in/magic-link") {
    if (
      body !== null &&
      typeof body === "object" &&
      "email" in body &&
      typeof (body as Record<string, unknown>).email === "string"
    ) {
      return ajAuth
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(request, {
          email: (body as Record<string, unknown>).email as string,
          userIdOrIp,
        })
    } else {
      return ajAuth
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp })
    }
  }

  return ajAuth
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp })
}
