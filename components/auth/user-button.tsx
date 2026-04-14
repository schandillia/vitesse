"use client"

import { useSession } from "@/lib/auth/auth-client"
import { useAuthActions } from "@/components/auth/hooks/use-auth-actions"
import { useLoginModal } from "@/components/auth/login-modal-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDropdownContent } from "@/components/auth/user-dropdown-content"
import { UserAvatar } from "@/components/auth/user-avatar"

export function UserButton() {
  const { openModal } = useLoginModal()

  // 1. Fetch data directly from Better Auth's client hook
  const { data: session, isPending } = useSession()

  // 2. Fetch actions from your custom hook
  const { handleSignOut } = useAuthActions()

  const user = session?.user

  // This pulse is exactly what you want on a static marketing page!
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
