"use client"

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
  GlobeLockIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldUserIcon,
  UserIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { UserInfo } from "@/components/auth/user-info"
import { ROLES } from "@/lib/auth/roles"

interface UserDropdownContentProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
  onSignOut: () => void
  variant?: "navbar" | "sidebar"
}

const menuItems = [
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/security", label: "Security", icon: GlobeLockIcon },
]

const baseItemClass = "rounded-md cursor-pointer py-1"

export function UserDropdownContent({
  user,
  onSignOut,
  variant = "navbar",
}: UserDropdownContentProps) {
  const isSidebar = variant === "sidebar"

  const align = isSidebar ? "start" : "end"
  const side = isSidebar ? "top" : "bottom"

  const pathname = usePathname()
  const filteredItems = menuItems.filter(
    (item) => !pathname.startsWith(item.href)
  )

  return (
    <DropdownMenuContent align={align} side={side} className="w-48 space-y-2">
      {/* Show only in navbar */}
      {!isSidebar && (
        <>
          <div className="px-2 py-1.5">
            <UserInfo user={user} />
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

      {user.role === ROLES.ADMIN && !pathname.startsWith("/admin") && (
        <DropdownMenuItem asChild className={baseItemClass}>
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldUserIcon className="size-4" />
            <span>Admin</span>
          </Link>
        </DropdownMenuItem>
      )}

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
