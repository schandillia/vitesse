"use client"

import { GlobeIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [{ href: "/general", label: "General", icon: GlobeIcon }]

interface ProfilePageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function ProfilePageSidebar({ user }: ProfilePageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
