"use client"

import { useLoginModal } from "@/components/auth/login-modal-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserMenu } from "@/components/auth/hooks/use-user-menu"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"
import { UserAvatar } from "@/components/auth/user-avatar"

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
        <UserAvatar user={user} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <UserDropdownContent
        user={user}
        onSignOut={handleSignOut}
        variant="navbar"
      />
    </DropdownMenu>
  )
}
