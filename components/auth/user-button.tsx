"use client"

import { useAuthActions } from "@/components/auth/hooks/use-auth-actions"
import { useLoginModal } from "@/components/auth/login-modal-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"
import { UserAvatar } from "@/components/auth/user-avatar"
import type { Session } from "@/lib/auth/auth"

interface UserButtonProps {
  session: Session | null
}

export function UserButton({ session }: UserButtonProps) {
  const { openModal } = useLoginModal()
  const { handleSignOut } = useAuthActions()

  const user = session?.user

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
