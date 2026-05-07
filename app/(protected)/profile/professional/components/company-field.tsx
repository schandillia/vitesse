"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authClient } from "@/lib/auth/auth-client"
import { companySchema } from "@/lib/validations/company-schema"

interface CompanyFieldProps {
  initialCompany: string | null | undefined
}

export function CompanyField({ initialCompany }: CompanyFieldProps) {
  const safeInitial = initialCompany || ""
  const [company, setCompany] = React.useState(safeInitial)
  const [isEditing, setIsEditing] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const router = useRouter()

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleCancel = () => {
    setCompany(safeInitial)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const cleanedInput = company.trim().replace(/\s+/g, " ")

    if (cleanedInput === safeInitial) {
      setCompany(safeInitial)
      setIsEditing(false)
      return
    }

    const validation = companySchema.safeParse(cleanedInput)

    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      setCompany(safeInitial)
      setIsEditing(false)
      return
    }

    const safeCompany = validation.data
    setCompany(safeCompany)
    setIsEditing(false)

    const { error } = await authClient.updateUser({
      company: safeCompany,
    })

    if (error) {
      toast.error(error.message || "Failed to update company")
      setCompany(safeInitial)
      return
    }

    toast.success("Company updated successfully")
    router.refresh()
  }

  const displayCompany = company || "e.g. Acme Inc."

  return (
    <p className="flex min-w-0 w-full items-center m-0 p-0 h-5">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={company}
          aria-label="Edit your company name"
          size={Math.max(company.length, 15)}
          onChange={(e) => setCompany(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 w-full h-5 text-sm leading-5 bg-transparent border-0 p-0 m-0 focus-visible:ring-0 focus-visible:outline-none text-foreground placeholder:text-muted-foreground/50"
          placeholder="e.g. Acme Inc."
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="cursor-text group flex h-5 w-full items-center justify-start gap-3 rounded-sm outline-none border-0 p-0 m-0 bg-transparent text-sm text-muted-foreground"
          aria-label={company ? `Edit company: ${company}` : "Add a company"}
        >
          <span
            className={`truncate leading-5 min-w-0 ${!company ? "opacity-40" : ""}`}
          >
            {displayCompany}
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
