"use client"

import { StoreIcon } from "lucide-react"
import type { auth } from "@/lib/auth/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"

const navItems = [{ href: "/store", label: "Store", icon: StoreIcon }]

interface ProtectedPageSidebarProps {
  user: typeof auth.$Infer.Session.user
}

export function ProtectedPageSidebar({ user }: ProtectedPageSidebarProps) {
  return <AppSidebar user={user} navItems={navItems} />
}
