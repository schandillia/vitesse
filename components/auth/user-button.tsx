"use client"

import { useLoginModal } from "@/components/auth/login-modal-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient, useSession } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { publicRoutes } from "@/routes"

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

export function UserButton() {
  const { openModal } = useLoginModal()
  const { data: session, isPending } = useSession()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    if (publicRoutes.has(window.location.pathname)) {
      router.refresh() // stay on page, just refresh to clear session UI
    } else {
      router.push("/")
      router.refresh()
    }
  }

  if (isPending) {
    return <div className="size-8 rounded-full bg-muted animate-pulse" />
  }

  if (!session) {
    return <Button onClick={openModal}>Log in</Button>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage
            src={session.user.image ?? undefined}
            alt={session.user.name || session.user.email}
          />
          <AvatarFallback>
            {getInitials(session.user.name, session.user.email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">
            {session.user.name || session.user.email}
          </p>
          {session.user.name && (
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
