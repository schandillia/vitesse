"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon, ShieldUserIcon, Trash2Icon } from "lucide-react"
import { ROLES, type Role } from "@/lib/auth/roles"
import { changeRole } from "@/actions/change-role"
import { deleteUser } from "@/actions/delete-user"
import { ConfirmModal } from "@/components/confirm-modal"
import toast from "react-hot-toast"

interface UserActionsProps {
  userId: string
  userName: string
  currentRole: Role
  isCurrentUser: boolean
}

const ALL_ROLES = Object.values(ROLES) as Role[]

export function UserActions({
  userId,
  userName,
  currentRole,
  isCurrentUser,
}: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  async function handleChangeRole(newRole: Role) {
    if (newRole === currentRole) return
    setIsLoading(true)
    const result = await changeRole(userId, newRole)
    setIsLoading(false)

    if (!result.success) {
      toast.error(result.error ?? "Failed to change role.")
      return
    }

    toast.success("Role updated successfully.")
    router.refresh()
  }

  async function handleDelete() {
    setIsLoading(true)
    const result = await deleteUser(userId)
    setIsLoading(false)

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete user.")
      return
    }

    setShowDeleteModal(false)
    toast.success("User deleted.")
    router.refresh()
  }

  return (
    <>
      <ConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title={
          <>
            Delete <span className="italic">{userName}</span>?
          </>
        }
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={isLoading || isCurrentUser}
            aria-label={
              isCurrentUser
                ? "You cannot modify your own account."
                : `Actions for ${userName}`
            }
            title={
              isCurrentUser ? "You cannot modify your own account." : "Actions"
            }
          >
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-max">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ShieldUserIcon className="size-4 mr-2" aria-hidden="true" />
              Change Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {ALL_ROLES.map((role) => (
                <DropdownMenuItem
                  key={role}
                  disabled={role === currentRole}
                  onClick={() => handleChangeRole(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {role === currentRole && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2Icon className="size-4 mr-2" aria-hidden="true" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
