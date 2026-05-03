"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLES } from "@/db/types/roles"

const ALL_ROLES = Object.values(ROLES)

export function UsersToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
          params.delete("page") // reset to page 1 on filter change
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = useDebouncedCallback((value: string) => {
    router.push(`${pathname}?${createQueryString({ search: value })}`)
  }, 400)

  function handleRoleFilter(value: string) {
    router.push(
      `${pathname}?${createQueryString({ role: value === "all" ? null : value })}`
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder="Search by name or email…"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
        aria-label="Search users"
      />
      <Select
        defaultValue={searchParams.get("role") ?? "all"}
        onValueChange={handleRoleFilter}
      >
        <SelectTrigger className="w-36" aria-label="Filter by role">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent className="p-1">
          <SelectItem value="all">All roles</SelectItem>
          {ALL_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
