"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EVENT_TYPES = [
  { value: "all", label: "All events" },
  { value: "login", label: "Login" },
  { value: "signup", label: "Signup" },
  { value: "role_change", label: "Role change" },
  { value: "user_deleted", label: "User deleted" },
]

export function ActivityToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleEventFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("event")
    } else {
      params.set("event", value)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        defaultValue={searchParams.get("event") ?? "all"}
        onValueChange={handleEventFilter}
      >
        <SelectTrigger className="w-40" aria-label="Filter by event type">
          <SelectValue placeholder="All events" />
        </SelectTrigger>
        <SelectContent className="p-1">
          {EVENT_TYPES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
