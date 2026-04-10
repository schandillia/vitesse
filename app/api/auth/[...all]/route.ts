import { auth } from "@/lib/auth"
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

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 })
    } else if (decision.reason.isEmail()) {
      let message: string

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Invalid email address."
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain not valid."
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed."
      } else {
        message = "Unknown error."
      }
      return Response.json(message, { status: 400 })
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
