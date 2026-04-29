"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"
import { nameSchema } from "@/lib/validations/name-schema"

interface EditableNameProps {
  initialName: string
}

export function EditableName({ initialName }: EditableNameProps) {
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
    // 1. Clean the input: Trim ends AND collapse internal consecutive spaces
    const cleanedInput = name.trim().replace(/\s+/g, " ")

    // Check 1: Use the cleaned input for comparison
    if (cleanedInput === initialName) {
      setName(initialName)
      setIsEditing(false)
      return
    }

    // Check 2: Pass the cleaned input to Zod
    const validation = nameSchema.safeParse(cleanedInput)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setName(initialName)
      setIsEditing(false)
      return
    }

    // Update UI with the perfectly formatted name
    const safeName = validation.data
    setName(safeName)
    setIsEditing(false)

    const { error } = await authClient.updateUser({
      name: safeName,
    })

    if (error) {
      toast.error(error.message || "Failed to update profile")
      setName(initialName) // Rollback UI if DB fails
      return
    }

    toast.success("Profile updated successfully")
    router.refresh()
  }

  return (
    <div className="mb-1 flex min-w-0 w-full items-center justify-center md:justify-start">
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
          className="h-8 rounded-none text-center md:text-left border-0 border-transparent bg-transparent! px-0 py-0 text-2xl font-bold tracking-tight shadow-none outline-none ring-0 focus:bg-transparent focus-visible:ring-0 active:bg-transparent md:text-2xl [&:-webkit-autofill]:delay-[9999s]"
        />
      ) : (
        <h2 className="text-2xl font-bold tracking-tight min-w-0 w-full">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-text group flex w-full items-center justify-center md:justify-start gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden before:block before:w-4 before:shrink-0 md:before:hidden"
            aria-label="Edit name"
          >
            <span className="truncate min-w-0">{name}</span>
            <PencilIcon
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground opacity-30"
              aria-hidden="true"
            />
          </button>
        </h2>
      )}
    </div>
  )
}
