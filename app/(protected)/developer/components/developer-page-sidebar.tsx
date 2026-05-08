"use client"

import { KeyRoundIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [
  { href: "/developer/api-keys", label: "API Keys", icon: KeyRoundIcon },
]

interface DeveloperPageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function DeveloperPageSidebar({ user }: DeveloperPageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
