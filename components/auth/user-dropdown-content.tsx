"use client"

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { LayoutDashboardIcon, LogOutIcon, SettingsIcon } from "lucide-react"
import { usePathname } from "next/navigation"

interface User {
  name: string
  email: string
}

interface UserDropdownContentProps {
  user: User
  onSignOut: () => void
  variant?: "navbar" | "sidebar"
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
]

const baseItemClass = "rounded-4xl focus:bg-sidebar-accent/20 cursor-pointer"

export function UserDropdownContent({
  user,
  onSignOut,
  variant = "navbar",
}: UserDropdownContentProps) {
  const isSidebar = variant === "sidebar"

  const align = isSidebar ? "start" : "end"
  const side = isSidebar ? "top" : "bottom"

  const pathname = usePathname()
  const filteredItems = menuItems.filter((item) => item.href !== pathname)

  return (
    <DropdownMenuContent align={align} side={side} className="w-48">
      {/* Show only in navbar */}
      {!isSidebar && (
        <>
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold text-muted-foreground truncate">
              {user.name || siteConfig.genericUser}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <DropdownMenuSeparator />
        </>
      )}

      {filteredItems.map((item) => {
        const Icon = item.icon
        return (
          <DropdownMenuItem key={item.href} asChild className={baseItemClass}>
            <Link href={item.href} className="flex items-center gap-2">
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        )
      })}

      <DropdownMenuSeparator />

      <DropdownMenuItem
        className={`${baseItemClass} text-destructive focus:text-destructive flex items-center gap-2`}
        onClick={onSignOut}
      >
        <LogOutIcon className="size-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
