"use client"

import { IdCardIcon, UserCircleIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [
  { href: "/profile/general", label: "General", icon: IdCardIcon },
  { href: "/profile/about", label: "About", icon: UserCircleIcon },
]

interface ProfilePageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function ProfilePageSidebar({ user }: ProfilePageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
