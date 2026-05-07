"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"
import { websiteSchema } from "@/lib/validations/website-schema"

interface WebsiteFieldProps {
  initialWebsite: string | null | undefined
}

export function WebsiteField({ initialWebsite }: WebsiteFieldProps) {
  const safeInitial = initialWebsite || ""
  const [website, setWebsite] = React.useState(safeInitial)
  const [isEditing, setIsEditing] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const router = useRouter()

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleCancel = () => {
    setWebsite(safeInitial)
    setIsEditing(false)
  }

  const handleSave = async () => {
    // Strip all spaces for URLs
    const cleanedInput = website.trim().replace(/\s+/g, "")

    if (cleanedInput === safeInitial) {
      setWebsite(safeInitial)
      setIsEditing(false)
      return
    }

    const validation = websiteSchema.safeParse(cleanedInput)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setWebsite(safeInitial)
      setIsEditing(false)
      return
    }

    const safeWebsite = validation.data
    setWebsite(safeWebsite)
    setIsEditing(false)

    const { error } = await authClient.updateUser({
      website: safeWebsite,
    })

    if (error) {
      toast.error(error.message || "Failed to update website")
      setWebsite(safeInitial) // Rollback UI if DB fails
      return
    }

    toast.success("Website updated successfully")
    router.refresh()
  }

  const displayWebsite = website || "e.g. yoursite.com"

  return (
    <p className="flex min-w-0 w-full items-center m-0 p-0 h-5">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={website}
          aria-label="Edit your website"
          size={Math.max(website.length, 15)}
          onChange={(e) => setWebsite(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 w-full h-5 text-sm leading-5 bg-transparent border-0 p-0 m-0 focus-visible:ring-0 focus-visible:outline-none text-foreground placeholder:text-muted-foreground/50"
          placeholder="e.g. yoursite.com"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="cursor-text group flex h-5 w-full items-center justify-start gap-3 rounded-sm outline-none border-0 p-0 m-0 bg-transparent text-sm text-muted-foreground"
          aria-label={website ? `Edit website: ${website}` : "Add a website"}
        >
          <span
            className={`truncate leading-5 min-w-0 ${!website ? "opacity-40" : ""}`}
          >
            {displayWebsite}
          </span>
          <PencilIcon
            className="size-3 shrink-0 transition-colors group-hover:text-foreground opacity-30"
            aria-hidden="true"
          />
        </button>
      )}
    </p>
  )
}
