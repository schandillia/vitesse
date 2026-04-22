"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"
import { authRoutes, publicRoutes } from "@/routes"

export function SessionWatcher() {
  const router = useRouter()
  const pathname = usePathname()

  const shouldWatchSession =
    !publicRoutes.has(pathname) && !authRoutes.has(pathname)

  // Track last user activity
  const lastActivityRef = useRef<number>(0)

  // Prevent duplicate redirects
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (!shouldWatchSession) return

    // Reset redirect guard on route change
    hasRedirectedRef.current = false

    lastActivityRef.current = Date.now()

    const updateActivity = () => {
      lastActivityRef.current = Date.now()
    }

    // Use pointer events (covers mouse + touch, lower noise than mousemove spam)
    window.addEventListener("pointermove", updateActivity, { passive: true })
    window.addEventListener("keydown", updateActivity, { passive: true })
    window.addEventListener("click", updateActivity, { passive: true })

    const checkSession = async () => {
      // Prevent duplicate execution after redirect
      if (hasRedirectedRef.current) return

      // Skip if tab not visible
      if (document.visibilityState === "hidden") return

      // Skip if user idle
      if (Date.now() - lastActivityRef.current > 5 * 60 * 1000) return

      const { data: session, error } = await authClient.getSession()

      if (error || !session) {
        hasRedirectedRef.current = true

        router.replace(
          `/login?session_expired=true&callbackUrl=${encodeURIComponent(pathname)}`
        )
      }
    }

    // Poll every 5 minutes
    const intervalId = setInterval(checkSession, 5 * 60 * 1000)

    // Run immediately when tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateActivity()
        checkSession()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener("pointermove", updateActivity)
      window.removeEventListener("keydown", updateActivity)
      window.removeEventListener("click", updateActivity)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [shouldWatchSession, router, pathname])

  return null
}
