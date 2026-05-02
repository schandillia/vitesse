"use client"

import {
  BellIcon,
  HardDriveDownloadIcon,
  IdCardIcon,
  PersonStandingIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [
  { href: "/profile/general", label: "General", icon: IdCardIcon },
  {
    href: "/profile/preferences",
    label: "Preferences",
    icon: SlidersHorizontalIcon,
  },
  {
    href: "/profile/accessibility",
    label: "Accessibility",
    icon: PersonStandingIcon,
  },
  { href: "/profile/notifications", label: "Notifications", icon: BellIcon },
  { href: "/profile/data", label: "Data", icon: HardDriveDownloadIcon },
]

interface ProfilePageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function ProfilePageSidebar({ user }: ProfilePageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
