"use client"

import { useLoginModal } from "@/components/auth/login-modal-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserMenu } from "@/components/auth/hooks/use-user-menu"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"

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
  const { user, isPending, handleSignOut } = useUserMenu()

  if (isPending) {
    return <div className="size-8 rounded-full bg-muted animate-pulse" />
  }

  if (!user) {
    return <Button onClick={openModal}>Log in</Button>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name || user.email}
          />
          <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <UserDropdownContent user={user} onSignOut={handleSignOut} align="end" />
    </DropdownMenu>
  )
}
