import { env } from "@/env"

const cloudfrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || ""

const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
const posthogAssetHost = posthogHost.replace(
  ".i.posthog.com",
  "-assets.i.posthog.com"
)

const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://lh3.googleusercontent.com", // Required for Google Avatars
    ...(cloudfrontUrl ? [cloudfrontUrl] : []),
    posthogAssetHost,
  ],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    "https://*.sentry.io",
    "https://*.ingest.sentry.io",
    "https://*.ingest.us.sentry.io",
    posthogHost,
    posthogAssetHost,
  ],
  "worker-src": ["'self'", "blob:"],
  "frame-src": ["'self'"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  ...(process.env.NODE_ENV === "production" &&
  env.NEXT_PUBLIC_APP_URL?.startsWith("https")
    ? { "upgrade-insecure-requests": [] }
    : {}),
}

export function buildCSP({
  nonce = "",
  useNonce = false,
}: { nonce?: string; useNonce?: boolean } = {}): string {
  const directives = { ...CSP_DIRECTIVES }

  if (useNonce && nonce) {
    directives["script-src"] = directives["script-src"].filter(
      (v) => v !== "'unsafe-inline'"
    )
    directives["script-src"].push(`'nonce-${nonce}'`)
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ")
}

export const CSP = buildCSP()
