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
import { ChevronsUpDownIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"
import { UserAvatar } from "@/components/auth/user-avatar"
import { UserInfo } from "@/components/auth/user-info"
import { useAuthActions } from "@/hooks/use-auth-actions"
import type { auth } from "@/lib/auth/auth"
import { ModeToggle } from "@/components/layout/mode-toggle"

export interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface AppSidebarProps {
  user: typeof auth.$Infer.Session.user
  navItems: NavItem[]
}

export function AppSidebar({ user, navItems }: AppSidebarProps) {
  const { handleSignOut } = useAuthActions()
  const pathname = usePathname()

  return (
    <>
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
        <SidebarHeader className="flex flex-row items-center justify-between px-2 py-1.5 pt-7 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label={`${siteConfig.brand.name} home`}
          >
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
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="group-data-[collapsible=icon]:hidden"
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <nav aria-label="Main navigation">
                <SidebarMenu className="space-y-4">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === href}
                        tooltip={label}
                        className="rounded-4xl h-10 data-[active=false]:bg-transparent data-[active=false]:hover:bg-sidebar-accent/20 data-[active=false]:hover:text-sidebar-accent-foreground"
                        aria-current={pathname === href ? "page" : undefined}
                      >
                        <Link href={href}>
                          <Icon />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

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
                      aria-label={`${user.name ?? "User"} menu`}
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
