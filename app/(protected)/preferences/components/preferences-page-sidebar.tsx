"use client"

import { MonitorIcon, PersonStandingIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [
  { href: "/preferences/display", label: "Display", icon: MonitorIcon },
  {
    href: "/preferences/accessibility",
    label: "Accessibility",
    icon: PersonStandingIcon,
  },
]

interface PreferencesPageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function PreferencesPageSidebar({ user }: PreferencesPageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
