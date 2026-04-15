"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { updateUserName } from "@/actions/user"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"

interface EditableNameProps {
  initialName: string
  userId: string
}

export function EditableName({ initialName, userId }: EditableNameProps) {
  const [name, setName] = React.useState(initialName)
  const [isEditing, setIsEditing] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const router = useRouter()

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleCancel = () => {
    setName(initialName)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (name.trim() === "" || name === initialName) {
      setIsEditing(false)
      return
    }

    setIsEditing(false)

    // 2. Use BetterAuth's built-in update method instead of your custom action
    // This updates the DB AND refreshes the session cookie automatically
    const { error } = await authClient.updateUser({
      name: name,
    })

    if (error) {
      toast.error(error.message || "Failed to update profile")
      setName(initialName)
      return
    }

    toast.success("Profile updated successfully")
    router.refresh()
  }

  return (
    <div className="mb-1 flex w-fit items-center">
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={name}
          aria-label="Edit your full name"
          size={Math.max(name.length, 5)}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
          autoComplete="off"
          spellCheck={false}
          className="h-8 rounded-none border-0 border-transparent bg-transparent! px-0 py-0 text-2xl font-bold tracking-tight shadow-none outline-none ring-0 focus:bg-transparent focus-visible:ring-0 active:bg-transparent md:text-2xl [&:-webkit-autofill]:delay-[9999s]"
        />
      ) : (
        <h2 className="text-2xl font-bold tracking-tight">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-text group flex items-center gap-2 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Edit name"
          >
            <span>{name}</span>
            <PencilIcon
              className="size-4 text-muted-foreground transition-colors group-hover:text-foreground ml-2 opacity-30"
              aria-hidden="true"
            />
          </button>
        </h2>
      )}
    </div>
  )
}
