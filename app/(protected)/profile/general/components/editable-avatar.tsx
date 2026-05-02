"use client"

import { useState, useRef } from "react"
import { UserAvatar } from "@/components/auth/user-avatar"
import { User } from "@/lib/auth/auth"
import { PencilIcon, Loader2Icon } from "lucide-react"
import { uploadAvatarAction } from "@/actions/upload-avatar"
import { authClient } from "@/lib/auth/auth-client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { avatarSchema } from "@/lib/validations/avatar-schema"

interface EditableAvatarProps {
  user: User
  className?: string
}

export function EditableAvatar({ user, className }: EditableAvatarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Client-side validation using same Zod schema
    const validation = avatarSchema.safeParse({ file })
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid image")
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadAvatarAction(formData)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      await authClient.updateUser({ image: result.url })
      toast.success("Profile picture updated successfully!")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("relative group inline-block", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Upload new profile picture"
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-full cursor-pointer transition-opacity h-full w-full",
          isUploading ? "opacity-50" : "group-hover:opacity-90"
        )}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <UserAvatar user={user} className="h-full w-full border-none" />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2Icon className="size-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {!isUploading && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-2 rounded-full bg-primary p-2 text-primary-foreground shadow-sm ring-2 ring-background transition-transform hover:scale-105 active:scale-95 md:bottom-4 md:right-4"
          aria-label="Edit profile picture"
        >
          <PencilIcon className="size-4 md:size-5" />
        </button>
      )}
    </div>
  )
}
