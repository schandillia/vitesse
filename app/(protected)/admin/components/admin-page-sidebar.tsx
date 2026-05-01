"use client"

import {
  ActivityIcon,
  LayoutDashboardIcon,
  ServerIcon,
  UsersIcon,
} from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/activity", label: "Activity", icon: ActivityIcon },
  { href: "/admin/system", label: "System", icon: ServerIcon },
]

interface AdminPageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function AdminPageSidebar({ user }: AdminPageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
