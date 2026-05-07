"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"
import { type SocialPlatform, type Socials } from "@/db/types/socials"
import { socialSchema } from "@/lib/validations/social-schema"

interface SocialFieldProps {
  platform: SocialPlatform
  label: string
  placeholder: string
  initialSocialsRaw: unknown
}

// Bulletproof parser moved inside the component
function parseSocials(raw: unknown): Socials {
  if (!raw) return {} as Socials
  if (typeof raw === "object") return raw as Socials
  if (typeof raw === "string") {
    if (raw === "[object Object]") return {} as Socials
    try {
      return JSON.parse(raw) as Socials
    } catch {
      return {} as Socials
    }
  }
  return {} as Socials
}

export function SocialField({
  platform,
  label,
  placeholder,
  initialSocialsRaw,
}: SocialFieldProps) {
  const currentSocials = parseSocials(initialSocialsRaw)
  const safeInitial = currentSocials[platform] || ""

  const [handle, setHandle] = React.useState(safeInitial)
  const [isEditing, setIsEditing] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const router = useRouter()

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleCancel = () => {
    setHandle(safeInitial)
    setIsEditing(false)
  }

  const handleSave = async () => {
    // Strip all spaces for social handles
    const cleanedInput = handle.trim().replace(/\s+/g, "")

    if (cleanedInput === safeInitial) {
      setHandle(safeInitial)
      setIsEditing(false)
      return
    }

    const validation = socialSchema.safeParse(cleanedInput)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setHandle(safeInitial)
      setIsEditing(false)
      return
    }

    const safeHandle = validation.data
    setHandle(safeHandle)
    setIsEditing(false)

    // Merge the new handle with the existing platforms
    const updatedSocials: Socials = {
      ...currentSocials,
      [platform]: safeHandle || undefined,
    }

    // Clean out undefined values to keep the JSON payload tidy
    const cleanedSocials = Object.fromEntries(
      Object.entries(updatedSocials).filter(([, v]) => v !== undefined)
    ) as Socials

    const { error } = await authClient.updateUser({
      socials: JSON.stringify(cleanedSocials),
    })

    if (error) {
      toast.error(error.message || `Failed to update ${label}`)
      setHandle(safeInitial) // Rollback UI
      return
    }

    toast.success(`${label} updated successfully`)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
        {label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="flex min-w-0 w-full items-center m-0 p-0 h-5">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={handle}
              aria-label={`Edit your ${label}`}
              size={Math.max(handle.length, 15)}
              onChange={(e) => setHandle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 w-full h-5 text-sm leading-5 bg-transparent border-0 p-0 m-0 focus-visible:ring-0 focus-visible:outline-none text-foreground placeholder:text-muted-foreground/50"
              placeholder={placeholder}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="cursor-text group flex h-5 w-full items-center justify-start gap-3 rounded-sm outline-none border-0 p-0 m-0 bg-transparent text-left"
              aria-label={handle ? `Edit ${label}: ${handle}` : `Add ${label}`}
            >
              <span className="text-sm text-muted-foreground leading-5 truncate min-w-0">
                {handle || (
                  <span className="text-muted-foreground/40">
                    {placeholder}
                  </span>
                )}
              </span>
              <PencilIcon
                className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground opacity-30"
                aria-hidden="true"
              />
            </button>
          )}
        </p>
      </div>
    </div>
  )
}
