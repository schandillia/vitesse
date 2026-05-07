"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"
import { jobTitleSchema } from "@/lib/validations/job-title-schema"

interface JobTitleFieldProps {
  initialJobTitle: string | null | undefined
}

export function JobTitleField({ initialJobTitle }: JobTitleFieldProps) {
  const safeInitial = initialJobTitle || ""
  const [jobTitle, setJobTitle] = React.useState(safeInitial)
  const [isEditing, setIsEditing] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const router = useRouter()

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleCancel = () => {
    setJobTitle(safeInitial)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const cleanedInput = jobTitle.trim().replace(/\s+/g, " ")

    if (cleanedInput === safeInitial) {
      setJobTitle(safeInitial)
      setIsEditing(false)
      return
    }

    const validation = jobTitleSchema.safeParse(cleanedInput)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setJobTitle(safeInitial)
      setIsEditing(false)
      return
    }

    const safeJobTitle = validation.data
    setJobTitle(safeJobTitle)
    setIsEditing(false)

    const { error } = await authClient.updateUser({
      jobTitle: safeJobTitle,
    })

    if (error) {
      toast.error(error.message || "Failed to update job title")
      setJobTitle(safeInitial)
      return
    }

    toast.success("Job title updated successfully")
    router.refresh()
  }

  // Unified the fallback placeholder text
  const displayTitle = jobTitle || "e.g. Software Engineer"

  return (
    <p className="flex min-w-0 w-full items-center m-0 p-0 h-5">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={jobTitle}
          aria-label="Edit your job title"
          size={Math.max(jobTitle.length, 15)}
          onChange={(e) => setJobTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 w-full h-5 text-sm leading-5 bg-transparent border-0 p-0 m-0 focus-visible:ring-0 focus-visible:outline-none text-foreground placeholder:text-muted-foreground/50"
          placeholder="e.g. Software Engineer"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="cursor-text group flex h-5 w-full items-center justify-start gap-3 rounded-sm outline-none border-0 p-0 m-0 bg-transparent text-sm text-muted-foreground"
          aria-label={
            jobTitle ? `Edit job title: ${jobTitle}` : "Add a job title"
          }
        >
          <span
            className={`truncate leading-5 min-w-0 ${!jobTitle ? "opacity-40" : ""}`}
          >
            {displayTitle}
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
