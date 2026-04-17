"use client"

import { useState, useRef } from "react"
import { UserAvatar } from "@/components/auth/user-avatar"
import { User } from "@/lib/auth/auth"
import { PencilIcon, Loader2Icon } from "lucide-react"
import { uploadAvatarAction } from "@/app/actions/upload-avatar"
import { authClient } from "@/lib/auth/auth-client" // Adjust path to your BetterAuth client
import toast from "react-hot-toast" // Updated to react-hot-toast
import { useRouter } from "next/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

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

    // Optional: Check file size (e.g., limit to 5MB)
    if (file.size > siteConfig.avatarSizeLimitInMB * 1024 * 1024) {
      toast.error(
        `Image must be smaller than ${siteConfig.avatarSizeLimitInMB}MB`
      )
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      // 1. Upload to S3 via Server Action
      const result = await uploadAvatarAction(formData)

      if (!result.success || !result.url) {
        throw new Error(result.error)
      }

      // 2. Update BetterAuth Session & Database
      await authClient.updateUser({
        image: result.url,
      })

      toast.success("Profile picture updated!")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update profile picture")
      console.error(error)
    } finally {
      setIsUploading(false)
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("relative group inline-block", className)}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg, image/png, image/webp"
        aria-label="Upload new profile picture"
      />

      {/* The Avatar */}
      <div
        className={cn(
          "relative overflow-hidden rounded-full cursor-pointer transition-opacity h-full w-full",
          isUploading ? "opacity-50" : "group-hover:opacity-90"
        )}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <UserAvatar user={user} className="h-full w-full border-none" />

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2Icon className="size-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Pencil Badge */}
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
