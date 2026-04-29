import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  onValidationError: (error) => {
    console.error("❌ Invalid environment variables:", error)
    throw new Error("Invalid environment variables")
  },
  server: {
    // Application
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),

    // Google OAuth
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

    // Database
    DATABASE_URL: z.url(),

    // Redis (optional — falls back gracefully if absent)
    UPSTASH_REDIS_REST_URL: z.url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

    // AWS (optional — only needed if avatar uploads are enabled)
    AWS_REGION: z.string().min(1).optional(),
    AWS_S3_BUCKET_NAME: z.string().min(1).optional(),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),

    // Resend
    RESEND_API_KEY: z.string().min(1),

    // Arcjet (optional — only needed if rate limiting is enabled)
    ARCJET_KEY: z.string().min(1).optional(),
    ARCJET_ENV: z.enum(["development", "production"]).optional(),

    // Sentry (optional — only needed if error monitoring is enabled)
    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  },

  client: {
    // Application
    NEXT_PUBLIC_APP_URL: z.url().optional(),

    // Better Auth
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),

    // Sentry (optional)
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),

    // PostHog (optional)
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),

    // CloudFront
    NEXT_PUBLIC_CLOUDFRONT_URL: z.url().optional(),
  },

  runtimeEnv: {
    // Server
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ARCJET_KEY: process.env.ARCJET_KEY,
    ARCJET_ENV: process.env.ARCJET_ENV as
      | "development"
      | "production"
      | undefined,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_CLOUDFRONT_URL: process.env.NEXT_PUBLIC_CLOUDFRONT_URL,
  },
})
