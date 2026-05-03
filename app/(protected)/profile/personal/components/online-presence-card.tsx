"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { PencilIcon } from "lucide-react"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { User } from "@/lib/auth/auth"
import {
  SOCIAL_PLATFORMS,
  type SocialPlatform,
  type Socials,
} from "@/db/types/socials"

interface OnlinePresenceCardProps {
  user: User
}

interface FieldRowProps {
  label: string
  value: string
  placeholder: string
  onSave: (val: string) => Promise<void>
}

function FieldRow({ label, value, placeholder, onSave }: FieldRowProps) {
  const [editing, setEditing] = useState(false)
  const [current, setCurrent] = useState(value)
  const [initial] = useState(value)

  async function handleSave() {
    const cleaned = current.trim()
    if (cleaned === initial) {
      setEditing(false)
      return
    }
    setEditing(false)
    await onSave(cleaned)
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-muted/40 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
        {label}
      </span>
      {editing ? (
        <input
          autoFocus
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") {
              setCurrent(initial)
              setEditing(false)
            }
          }}
          className="flex-1 text-sm bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:outline-none text-foreground placeholder:text-muted-foreground/50"
          placeholder={placeholder}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="cursor-text group flex flex-1 items-center justify-between gap-4 rounded-sm outline-none text-left"
          aria-label={`Edit ${label}`}
        >
          <span className="text-sm text-muted-foreground flex-1">
            {current || (
              <span className="text-muted-foreground/40">{placeholder}</span>
            )}
          </span>
          <PencilIcon
            className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground opacity-30"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  )
}

const SOCIAL_PLACEHOLDERS: Record<SocialPlatform, string> = {
  github: "e.g. yourhandle",
  twitter: "e.g. yourhandle",
  linkedin: "e.g. yourhandle",
  instagram: "e.g. yourhandle",
  youtube: "e.g. yourchannel",
}

export function OnlinePresenceCard({ user }: OnlinePresenceCardProps) {
  const router = useRouter()
  const socials = user.socials
    ? (JSON.parse(user.socials as string) as Socials)
    : ({} as Socials)

  async function handleWebsiteUpdate(value: string) {
    const { error } = await authClient.updateUser({ website: value || null })
    if (error) {
      toast.error(error.message || "Failed to update website")
      return
    }
    toast.success("Profile updated!")
    router.refresh()
  }

  async function handleSocialUpdate(platform: SocialPlatform, value: string) {
    const updated: Socials = {
      ...socials,
      [platform]: value || undefined,
    }

    // Remove undefined keys so the jsonb stays clean
    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([, v]) => v !== undefined)
    ) as Socials

    const { error } = await authClient.updateUser({
      socials: JSON.stringify(cleaned),
    })
    if (error) {
      toast.error(error.message || `Failed to update ${platform}`)
      return
    }
    toast.success("Profile updated!")
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Online Presence" />
      <Card className="max-w-2xl border-muted/60 shadow-xs">
        <CardContent className="px-6 py-2">
          <FieldRow
            label="Website"
            value={user.website ?? ""}
            placeholder="e.g. https://yoursite.com"
            onSave={handleWebsiteUpdate}
          />
          {SOCIAL_PLATFORMS.map((platform) => (
            <FieldRow
              key={platform}
              label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              value={socials[platform] ?? ""}
              placeholder={SOCIAL_PLACEHOLDERS[platform]}
              onSave={(val) => handleSocialUpdate(platform, val)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
