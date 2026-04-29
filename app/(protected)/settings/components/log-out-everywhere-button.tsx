"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import toast from "react-hot-toast"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { useAnalytics } from "@/app/hooks/use-analytics"
import { siteConfig } from "@/config/site"
import { authChannel } from "@/lib/auth/broadcast"

function formatCacheTime(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`

  const years = Math.floor(minutes / 525960) // 365.25 days
  const weeks = Math.floor((minutes % 525960) / 10080)
  const days = Math.floor((minutes % 10080) / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const remainder = minutes % 60

  const yearStr = years > 0 ? `${years} year${years === 1 ? "" : "s"}` : ""
  const weekStr = weeks > 0 ? `${weeks} week${weeks === 1 ? "" : "s"}` : ""
  const dayStr = days > 0 ? `${days} day${days === 1 ? "" : "s"}` : ""
  const hourStr = hours > 0 ? `${hours} hour${hours === 1 ? "" : "s"}` : ""
  const minStr =
    remainder > 0 ? `${remainder} minute${remainder === 1 ? "" : "s"}` : ""

  return [yearStr, weekStr, dayStr, hourStr, minStr].filter(Boolean).join(" ")
}

export function LogOutEverywhereButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { reset } = useAnalytics()

  async function handleLogOutEverywhere() {
    setLoading(true)

    try {
      const { error } = await authClient.revokeSessions()

      if (error) {
        toast.error("Failed to log out from all devices")
        return
      }

      reset()

      authChannel?.postMessage({ type: "LOGOUT" })
      await authClient.signOut()
      toast.success("Logged out from all devices")
      router.push("/login")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        onClick={handleLogOutEverywhere}
        disabled={loading}
      >
        <LoadingSwap isLoading={loading}>Log Out Everywhere </LoadingSwap>
      </Button>
      {!siteConfig.authAndSession.logOutEverywhereInstantly && (
        <p className="text-sm text-muted-foreground mt-2">
          Other devices may take up to{" "}
          {formatCacheTime(siteConfig.authAndSession.cookieMaxAgeInMinutes)} to
          be logged out.
        </p>
      )}
    </>
  )
}
