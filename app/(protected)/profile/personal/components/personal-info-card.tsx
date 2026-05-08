"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { User } from "@/lib/auth/auth"
import { BirthdayField } from "@/app/(protected)/profile/personal/components/birthday-field"
import { LocationField } from "@/app/(protected)/profile/personal/components/location-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PersonalInfoCardProps {
  user: User
}

/* -------------------- Locale Field -------------------- */

const LOCALES = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-IN", label: "English (India)" },
  { value: "hi-IN", label: "Hindi (India)" },
]

interface LocaleFieldProps {
  value: string
  onSave: (val: string) => Promise<boolean>
}

function LocaleField({ value, onSave }: LocaleFieldProps) {
  const [prevValue, setPrevValue] = useState(value)
  const [current, setCurrent] = useState(value)

  // The React-approved way to sync props to state without useEffect
  if (value !== prevValue) {
    setPrevValue(value)
    setCurrent(value)
  }

  async function handleChange(val: string) {
    setCurrent(val)

    if (val === value) return

    const success = await onSave(val)
    if (!success) {
      setCurrent(value)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span
        id="locale-label"
        className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0"
      >
        Locale
      </span>

      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger aria-labelledby="locale-label" className="flex-1">
          <SelectValue placeholder="Select locale" />
        </SelectTrigger>

        <SelectContent className="p-1">
          {LOCALES.map((l) => (
            <SelectItem key={l.value} value={l.value}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/* -------------------- Main Component -------------------- */

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const router = useRouter()

  async function handleUpdate(field: string, value: string): Promise<boolean> {
    const payload: Record<string, unknown> =
      field === "dateOfBirth" && value
        ? { dateOfBirth: new Date(value) }
        : { [field]: value || null }

    const { error } = await authClient.updateUser(payload)

    if (error) {
      toast.error(error.message || `Failed to update ${field}`)
      return false
    }

    toast.success("Profile updated!")
    router.refresh()
    return true
  }

  const dobValue = user.dateOfBirth
    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
    : ""

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Place, Language, Etc." />

      <Card className="max-w-2xl overflow-visible">
        <CardContent className="px-6 py-2">
          <BirthdayField
            value={dobValue}
            onSave={(val) => handleUpdate("dateOfBirth", val)}
          />

          <LocationField
            value={user.location ?? ""}
            onSave={(val) => handleUpdate("location", val)}
            onError={(msg) => toast.error(msg)}
          />

          <LocaleField
            value={user.locale ?? "en-US"}
            onSave={(val) => handleUpdate("locale", val)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
