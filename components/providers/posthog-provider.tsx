"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { siteConfig } from "@/config/site"
import { env } from "@/env"
import { useConsent } from "@/components/providers/consent-provider"

const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
const posthogUiHost = posthogHost.replace(".i.posthog.com", ".posthog.com")

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()
  const lastTrackedUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!posthogClient) return

    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

    if (url !== lastTrackedUrl.current) {
      lastTrackedUrl.current = url
      posthogClient.capture("$pageview", { $current_url: window.location.href })
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

function PostHogInit() {
  const { consent } = useConsent()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!siteConfig.analytics.postHog.enabled || !env.NEXT_PUBLIC_POSTHOG_KEY)
      return

    if (consent?.analytics) {
      if (!posthog.__loaded) {
        posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: "/ingest",
          ui_host: posthogUiHost,
          person_profiles: "identified_only",
          capture_pageview: false,
          capture_pageleave: true,
          opt_out_capturing_by_default: false,
        })
      }
      posthog.clear_opt_in_out_capturing()
      posthog.opt_in_capturing()
      if (!hasInitialized.current) {
        posthog.capture("$pageview", { $current_url: window.location.href })
        hasInitialized.current = true
      }
    } else if (consent !== null) {
      posthog.opt_out_capturing()
    }
  }, [consent])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // If the feature is disabled, render nothing but the app itself
  if (!siteConfig.analytics.postHog.enabled) {
    return <>{children}</>
  }

  // If enabled, wrap the app in the provider and start tracking
  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
