import { Pagination } from "@/app/(protected)/admin/users/components/pagination"
import { UsersTable } from "@/app/(protected)/admin/users/components/users-table"
import { UsersToolbar } from "@/app/(protected)/admin/users/components/users-toolbar"
import { UserRow } from "@/app/(protected)/admin/users/types"

interface UsersSectionProps {
  users: UserRow[]
  currentUserId: string
  currentPage: number
  totalPages: number
}

export function UsersSection({
  users,
  currentUserId,
  currentPage,
  totalPages,
}: UsersSectionProps) {
  return (
    <div className="space-y-2">
      <UsersToolbar />
      <UsersTable users={users} currentUserId={currentUserId} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
