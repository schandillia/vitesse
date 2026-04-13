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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Settings, ChevronsUpDown, User } from "lucide-react"
import Link from "next/link"
import { useUserMenu } from "@/components/auth/hooks/use-user-menu"
import { usePathname } from "next/navigation"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"

const navItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
]

function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0].toUpperCase()
}

export function AppSidebar() {
  const { user, handleSignOut } = useUserMenu()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      {/* Header — brand */}
      <SidebarHeader className="flex flex-row items-center justify-between px-2 py-1.5">
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
                    className="rounded-4xl data-[active=false]:bg-transparent data-[active=false]:hover:bg-sidebar-accent/20 data-[active=false]:hover:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-6">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name || user.email}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-sm font-medium truncate">
                        {user.name || user.email}
                      </span>
                      {user.name && (
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <UserDropdownContent
                  user={user}
                  onSignOut={handleSignOut}
                  align="start"
                  side="top"
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
