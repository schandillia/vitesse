"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { User } from "@/lib/auth/auth"
import { SOCIAL_CONFIG, SOCIAL_PLATFORMS } from "@/db/types/socials"
import { WebsiteField } from "@/app/(protected)/profile/professional/components/website-field"
import { SocialField } from "@/app/(protected)/profile/professional/components/social-field"

interface OnlinePresenceCardProps {
  user: User
}

export function OnlinePresenceCard({ user }: OnlinePresenceCardProps) {
  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Online Presence" />
      <Card className="max-w-2xl">
        <CardContent className="px-6 py-2">
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
              Website
            </span>
            <div className="flex-1 min-w-0">
              <WebsiteField initialWebsite={user.website} />
            </div>
          </div>

          {SOCIAL_PLATFORMS.map((platform) => (
            <SocialField
              key={platform}
              platform={platform}
              label={SOCIAL_CONFIG[platform].label}
              placeholder={SOCIAL_CONFIG[platform].placeholder}
              initialSocialsRaw={user.socials}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
