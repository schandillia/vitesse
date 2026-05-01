"use client"

import { GlobeIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [{ href: "/general", label: "General", icon: GlobeIcon }]

interface SettingsPageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function SettingsPageSidebar({ user }: SettingsPageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
