"use client"

import { useCookieConsent } from "@/hooks/use-cookie-consent"
import { CookieCategories } from "@/components/cookies/cookie-categories"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export function CookiePreferences() {
  const { analytics, setAnalytics, marketing, setMarketing, loading, save } =
    useCookieConsent()

  async function handleSave() {
    await save()
    toast.success("Cookie preferences saved.")
  }

  if (loading) return null

  return (
    <div className="rounded-2xl border p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Manage Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your cookie preferences at any time. Changes take effect
          immediately.
        </p>
      </div>

      <CookieCategories
        analytics={analytics}
        marketing={marketing}
        onAnalyticsChange={setAnalytics}
        onMarketingChange={setMarketing}
      />

      <Button onClick={handleSave} className="w-full">
        Save preferences
      </Button>
    </div>
  )
}
