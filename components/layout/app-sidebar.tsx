"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { siteConfig } from "@/config/site"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Settings, ChevronsUpDown, User } from "lucide-react"
import Link from "next/link"
import { useUserMenu } from "@/components/auth/hooks/use-user-menu"
import { usePathname } from "next/navigation"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"
import { UserAvatar } from "@/components/auth/user-avatar"
import { UserInfo } from "@/components/auth/user-info"

const navItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const { user, handleSignOut } = useUserMenu()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      {/* Header — brand */}
      <SidebarHeader className="flex flex-row items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
        {" "}
        <Link href="/" className="flex items-center gap-2">
          <img src="/brand-logo.svg" alt={siteConfig.name} className="size-6" />
          <span className="font-brand font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {siteConfig.name}
          </span>
        </Link>
        <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      {/* Nav links */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    tooltip={label}
                    className="rounded-4xl h-10 data-[active=false]:bg-transparent data-[active=false]:hover:bg-sidebar-accent/20 data-[active=false]:hover:text-sidebar-accent-foreground"
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="cursor-pointer rounded-4xl data-[active=false]:bg-transparent data-[active=false]:hover:bg-sidebar-accent/20 data-[active=false]:hover:text-sidebar-accent-foreground focus-visible:ring-1 focus-visible:ring-sidebar-accent/30"
                  >
                    <UserAvatar user={user} />
                    <UserInfo
                      user={user}
                      className="flex flex-col min-w-0 text-left leading-tight"
                    />
                    <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <UserDropdownContent
                  user={user}
                  onSignOut={handleSignOut}
                  variant="sidebar"
                />
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
