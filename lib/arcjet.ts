import arcjet, { shield } from "@arcjet/next"
import { env } from "@/env"

// 1. Standard Instance: Uses default IP tracking (for contact forms, public routes)
export const aj = arcjet({
  key: env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [shield({ mode: "LIVE" })],
})

// 2. Auth Instance: Uses custom User ID or IP fingerprinting (for auth routes)
export const ajAuth = arcjet({
  key: env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
})

// 3. Universal Error Parser: Use this anywhere Arcjet blocks a request
type ArcjetDecision = {
  reason: {
    isRateLimit: () => boolean
    isEmail: () => boolean
    emailTypes?: string[]
  }
}
export function getArcjetErrorMessage(decision: ArcjetDecision): string {
  if (decision.reason.isRateLimit()) {
    return "Too many attempts. Please try again later."
  }
  if (decision.reason.isEmail()) {
    const types = decision.reason.emailTypes ?? []
    if (types.includes("INVALID")) return "Invalid email address."
    if (types.includes("NO_MX_RECORDS")) return "Email domain not valid."
    if (types.includes("DISPOSABLE"))
      return "Disposable email addresses are not allowed."
  }
  return "Request blocked by security protocols."
}
