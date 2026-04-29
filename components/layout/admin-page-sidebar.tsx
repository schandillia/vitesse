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
import {
  LayoutDashboardIcon,
  SettingsIcon,
  ShieldIcon,
  ChevronsUpDownIcon,
  User,
  UsersIcon,
  ActivityIcon,
  ServerIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"
import { UserAvatar } from "@/components/auth/user-avatar"
import { UserInfo } from "@/components/auth/user-info"
import { useAuthActions } from "@/components/auth/hooks/use-auth-actions"
import type { auth } from "@/lib/auth/auth"
import { ModeToggle } from "@/components/layout/mode-toggle"

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
  const { handleSignOut } = useAuthActions()
  const pathname = usePathname()

  return (
    <>
      {/* Scoped style block to restore mobile sidebar animations 
        without touching globals.css or sidebar.tsx 
      */}
      <style suppressHydrationWarning>{`
        @keyframes mobile-sidebar-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes mobile-sidebar-out {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        div[data-sidebar="sidebar"][data-mobile="true"][data-state="open"] {
          animation: mobile-sidebar-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }
        div[data-sidebar="sidebar"][data-mobile="true"][data-state="closed"] {
          animation: mobile-sidebar-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }
      `}</style>

      <Sidebar collapsible="icon">
        {/* Header — brand */}
        <SidebarHeader className="flex flex-row items-center justify-between px-2 py-1.5 pt-7 group-data-[collapsible=icon]:justify-center">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand-logo.svg"
              alt={siteConfig.brand.name}
              className="size-6"
            />
            <span className="font-bold text-2xl text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {siteConfig.brand.name}
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
          <div className="flex w-full justify-center pb-2">
            <ModeToggle expanded />
          </div>
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
                      <ChevronsUpDownIcon className="ml-auto size-4 shrink-0" />
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
    </>
  )
}
