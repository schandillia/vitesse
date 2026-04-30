"use client"

import { usePostHog } from "posthog-js/react"
import { siteConfig } from "@/config/site"

export function useAnalytics() {
  const posthog = usePostHog()

  function capture(event: string, properties?: Record<string, unknown>) {
    if (!siteConfig.analytics.postHog.enabled || !posthog) return
    posthog.capture(event, properties)
  }

  function identify(userId: string, properties?: Record<string, unknown>) {
    if (!siteConfig.analytics.postHog.enabled || !posthog) return
    posthog.identify(userId, properties)
  }

  function reset() {
    if (!siteConfig.analytics.postHog.enabled || !posthog) return
    posthog.reset()
  }

  return { capture, identify, reset }
}
