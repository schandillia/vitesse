"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"
import { usernameSchema } from "@/lib/validations/username-schema"

interface EditableUsernameProps {
  initialUsername: string
}

export function EditableUsername({ initialUsername }: EditableUsernameProps) {
  const [username, setUsername] = React.useState(initialUsername)
  const [isEditing, setIsEditing] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleCancel = () => {
    setUsername(initialUsername)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const cleaned = username.trim().toLowerCase()

    if (cleaned === initialUsername) {
      setUsername(initialUsername)
      setIsEditing(false)
      return
    }

    const validation = usernameSchema.safeParse(cleaned)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setUsername(initialUsername)
      setIsEditing(false)
      return
    }

    const safeUsername = validation.data
    setUsername(safeUsername)
    setIsEditing(false)

    const { error } = await authClient.updateUser({ username: safeUsername })

    if (error) {
      toast.error(error.message || "Failed to update username")
      setUsername(initialUsername)
      return
    }

    toast.success("Username updated!")
    router.refresh()
  }

  return (
    <div className="mb-1 flex min-w-0 w-full items-center justify-center md:justify-start">
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={username}
          aria-label="Edit your username"
          size={Math.max(username.length, 5)}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
          autoComplete="off"
          spellCheck={false}
          className="h-8 rounded-none text-center md:text-left border-0 border-transparent bg-transparent! px-0 py-0 text-sm font-medium tracking-tight shadow-none outline-none ring-0 focus:bg-transparent focus-visible:ring-0 active:bg-transparent [&:-webkit-autofill]:delay-[9999s]"
        />
      ) : (
        <p className="text-sm font-medium text-muted-foreground min-w-0 w-full h-8 flex items-center">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-text group flex w-full items-center justify-center md:justify-start gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden before:block before:w-4 before:shrink-0 md:before:hidden h-8"
            aria-label="Edit username"
          >
            <span className="truncate min-w-0">{username}</span>
            <PencilIcon
              className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground opacity-30"
              aria-hidden="true"
            />
          </button>
        </p>
      )}
    </div>
  )
}
