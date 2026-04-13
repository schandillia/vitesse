// app/api/auth/[...all]/route.ts
export const runtime = "nodejs"

import { auth } from "@/lib/auth/auth"
import { toNextJsHandler } from "better-auth/next-js"
import arcjet, {
  BotOptions,
  EmailOptions,
  shield,
  SlidingWindowRateLimitOptions,
  protectSignup,
  detectBot,
  slidingWindow,
} from "@arcjet/next"
import { findIp } from "@arcjet/ip"

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
})

const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions
const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
} as SlidingWindowRateLimitOptions<[]>
const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} as SlidingWindowRateLimitOptions<[]>
const emailSettings = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions

const authHandlers = toNextJsHandler(auth)

export const { GET } = authHandlers

export async function POST(request: Request) {
  const clonedRequest = request.clone()
  const decision = await checkArcjet(request)

  function getEmailErrorMessage(emailTypes: string[]): string {
    if (emailTypes.includes("INVALID")) return "Invalid email address."
    if (emailTypes.includes("NO_MX_RECORDS")) return "Email domain not valid."
    if (emailTypes.includes("DISPOSABLE"))
      return "Disposable email addresses are not allowed."
    return "Unknown error."
  }

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return Response.json(
        { message: "Too many attempts. Please try after some time." },
        { status: 429 }
      )
    } else if (decision.reason.isEmail()) {
      return Response.json(
        { message: getEmailErrorMessage(decision.reason.emailTypes) },
        { status: 400 }
      )
    } else {
      return new Response(null, { status: 403 })
    }
  }
  return authHandlers.POST(clonedRequest)
}

async function checkArcjet(request: Request) {
  const body = (await request.json()) as unknown
  const session = await auth.api.getSession({ headers: request.headers })

  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1"

  if (new URL(request.url).pathname === "/api/auth/sign-in/magic-link") {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(request, { email: body.email, userIdOrIp })
    } else {
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp })
    }
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp })
}
