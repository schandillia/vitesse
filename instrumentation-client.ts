// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { siteConfig } from "@/config/site"
import { env } from "@/env"
import * as Sentry from "@sentry/nextjs"

if (siteConfig.monitoring.sentry.enabled) {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: siteConfig.monitoring.sentry.tracesSampleRate,
    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate:
      siteConfig.monitoring.sentry.replaysSessionSampleRate,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate:
      siteConfig.monitoring.sentry.replaysOnErrorSampleRate,

    // Enable sending user PII (Personally Identifiable Information)
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
    sendDefaultPii: siteConfig.monitoring.sentry.sendDefaultPii,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
