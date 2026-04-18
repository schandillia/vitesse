"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { siteConfig } from "@/config/site"
import { env } from "@/env"

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

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize if the toggle is ON and the key exists
    if (siteConfig.enablePostHog && env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest", // Use the Next.js proxy tunnel to bypass ad-blockers
        ui_host: posthogUiHost, // Keep UI tools pointing to PostHog
        person_profiles: "identified_only", // Privacy friendly
        capture_pageview: false, // Disabled here because PostHogPageView handles it
        capture_pageleave: true,
      })
    }
  }, [])

  // If the feature is disabled, render nothing but the app itself
  if (!siteConfig.enablePostHog) {
    return <>{children}</>
  }

  // If enabled, wrap the app in the provider and start tracking
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
