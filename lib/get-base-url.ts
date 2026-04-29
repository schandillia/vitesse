import { env } from "@/env"

export function getBaseUrl() {
  // 1. If running on the client, just return the browser's current origin
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // 2. If we are on Vercel production, use the official production URL
  //   if (env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
  //     return `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  //   }

  // 3. If we are on a Vercel preview branch, use the dynamic preview URL
  //   if (env.NEXT_PUBLIC_VERCEL_URL) {
  //     return `https://${env.NEXT_PUBLIC_VERCEL_URL}`
  //   }

  // 4. Fallback to local development or explicit overrides
  return env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}
