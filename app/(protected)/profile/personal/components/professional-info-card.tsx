"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { PencilIcon } from "lucide-react"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { User } from "@/lib/auth/auth"

interface ProfessionalInfoCardProps {
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

export function ProfessionalInfoCard({ user }: ProfessionalInfoCardProps) {
  const router = useRouter()

  async function handleUpdate(field: string, value: string) {
    const { error } = await authClient.updateUser({ [field]: value || null })
    if (error) {
      toast.error(error.message || `Failed to update ${field}`)
      return
    }
    toast.success("Profile updated!")
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Work" />
      <Card className="max-w-2xl border-muted/60 shadow-xs">
        <CardContent className="px-6 py-2">
          <FieldRow
            label="Job Title"
            value={user.jobTitle ?? ""}
            placeholder="e.g. Software Engineer"
            onSave={(val) => handleUpdate("jobTitle", val)}
          />
          <FieldRow
            label="Company"
            value={user.company ?? ""}
            placeholder="e.g. Acme Inc."
            onSave={(val) => handleUpdate("company", val)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
