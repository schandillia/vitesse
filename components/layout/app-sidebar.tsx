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
import { useSession } from "@/lib/auth-client"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Settings,
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { publicRoutes } from "@/routes"

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
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    if (publicRoutes.has(pathname)) {
      router.refresh()
    } else {
      router.push("/")
      router.refresh()
    }
  }

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
                    className="rounded-4xl h-10 data-[active=false]:bg-transparent data-[active=false]:hover:bg-sidebar-accent data-[active=false]:hover:text-sidebar-accent-foreground"
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
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[active=false]:bg-transparent data-[active=false]:hover:bg-sidebar-accent data-[active=false]:hover:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-6">
                      <AvatarImage
                        src={session.user.image ?? undefined}
                        alt={session.user.name || session.user.email}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(session.user.name, session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-sm font-medium truncate">
                        {session.user.name || session.user.email}
                      </span>
                      {session.user.name && (
                        <span className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
