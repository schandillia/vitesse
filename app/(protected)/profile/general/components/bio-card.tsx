"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { PencilIcon } from "lucide-react"
import { bioSchema } from "@/lib/validations/bio-schema"
import { siteConfig } from "@/config/site"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

const MAX_BIO_LENGTH = siteConfig.users.maxBioLength

interface BioCardProps {
  initialBio: string | null
}

export function BioCard({ initialBio }: BioCardProps) {
  const [bio, setBio] = useState(initialBio ?? "")
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  function handleCancel() {
    setBio(initialBio ?? "")
    setIsEditing(false)
  }

  async function handleSave() {
    const cleaned = bio.trim()

    if (cleaned === (initialBio ?? "")) {
      setIsEditing(false)
      return
    }

    const validation = bioSchema.safeParse(cleaned)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setBio(initialBio ?? "")
      setIsEditing(false)
      return
    }

    setIsEditing(false)

    const { error } = await authClient.updateUser({ bio: cleaned || null })

    if (error) {
      toast.error(error.message || "Failed to update bio")
      setBio(initialBio ?? "")
      return
    }

    toast.success("Bio updated!")
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Brief Bio" />
      <Card className="max-w-2xl border-muted/60 shadow-xs">
        <CardContent>
          {isEditing ? (
            <>
              <textarea
                ref={textareaRef}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                className="resize-none text-sm bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:outline-none w-full text-foreground placeholder:text-muted-foreground/50"
                aria-label="Edit your bio"
                rows={4}
                maxLength={MAX_BIO_LENGTH}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancel()
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSave()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {bio.length}/{MAX_BIO_LENGTH}
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="cursor-text group flex w-full items-start gap-4 rounded-sm outline-none text-left"
              aria-label="Edit bio"
            >
              <p className="text-muted-foreground flex-1">
                {bio || "No bio yet. Click to add one."}
              </p>
              <PencilIcon
                className="size-3 shrink-0 mt-0.5 text-muted-foreground transition-colors group-hover:text-foreground opacity-30"
                aria-hidden="true"
              />
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
