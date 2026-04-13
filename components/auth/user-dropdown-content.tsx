"use client"

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { siteConfig } from "@/config/site"

type Props = {
  user: {
    name: string
    email: string
  }
  onSignOut: () => void
  align?: "start" | "end"
  side?: "top" | "bottom"
}

export function UserDropdownContent({
  user,
  onSignOut,
  align = "end",
  side,
}: Props) {
  return (
    <DropdownMenuContent align={align} side={side} className="w-48">
      <div className="px-2 py-1.5">
        <p className="text-sm font-semibold text-muted-foreground truncate">
          {user.name || siteConfig.genericUser}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        asChild
        className="rounded-4xl focus:bg-sidebar-accent/20 cursor-pointer"
      >
        <Link href="/dashboard">Dashboard</Link>
      </DropdownMenuItem>

      <DropdownMenuItem
        asChild
        className="rounded-4xl focus:bg-sidebar-accent/20 cursor-pointer"
      >
        <Link href="/settings">Settings</Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        className="rounded-4xl focus:bg-sidebar-accent/20 cursor-pointer text-destructive focus:text-destructive"
        onClick={onSignOut}
      >
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
