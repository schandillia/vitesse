"use client"

import { AppWindowIcon, ShieldCheckIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [
  {
    href: "/security/authentication",
    label: "Authentication",
    icon: ShieldCheckIcon,
  },
  { href: "/security/sessions", label: "Sessions", icon: AppWindowIcon },
]

interface SecurityPageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function SecurityPageSidebar({ user }: SecurityPageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
