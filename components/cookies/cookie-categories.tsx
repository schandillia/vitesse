"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CookieCategoriesProps {
  analytics: boolean
  marketing: boolean
  onAnalyticsChange: (checked: boolean) => void
  onMarketingChange: (checked: boolean) => void
}

export function CookieCategories({
  analytics,
  marketing,
  onAnalyticsChange,
  onMarketingChange,
}: CookieCategoriesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor="essential" className="font-medium">
            Essential
          </Label>
          <p className="text-xs text-muted-foreground">
            Required for the site to function. Cannot be disabled.
          </p>
        </div>
        <Checkbox id="essential" checked disabled />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor="analytics" className="font-medium">
            Analytics
          </Label>
          <p className="text-xs text-muted-foreground">
            Helps us understand how you use the site. We use PostHog for
            analytics.
          </p>
        </div>
        <Checkbox
          id="analytics"
          checked={analytics}
          onCheckedChange={(checked) => onAnalyticsChange(checked === true)}
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor="marketing" className="font-medium">
            Marketing
          </Label>
          <p className="text-xs text-muted-foreground">
            Used to show relevant advertisements and track their performance.
          </p>
        </div>
        <Checkbox
          id="marketing"
          checked={marketing}
          onCheckedChange={(checked) => onMarketingChange(checked === true)}
        />
      </div>
    </div>
  )
}
