import { env } from "@/env"
import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

// 1. Read the host variable (fallback to US if missing)
const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

// 2. Dynamically construct the asset host by injecting "-assets" into the domain string
const posthogAssetHost = posthogHost.replace(
  ".i.posthog.com",
  "-assets.i.posthog.com"
)

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: `10mb`,
    },
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ingest/static/:path*",
          destination: `${posthogAssetHost}/static/:path*`,
        },
        {
          source: "/ingest/:path*",
          destination: `${posthogHost}/:path*`,
        },
      ],
    }
  },
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "oolway-2v", // Must match the actual organization slug in Sentry settings
  project: "tickets", // Must match the actual project slug in Sentry settings
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  // Skip source map uploads and release creation in CI — SENTRY_AUTH_TOKEN is a dummy value there
  sourcemaps: {
    disable: process.env.CI === "true",
  },
  // release: {
  //   create: process.env.CI !== "true",
  //   finalize: process.env.CI !== "true",
  // },

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
})
