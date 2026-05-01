import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RoleBadge } from "@/components/role-badge"
import { UserActions } from "@/app/(protected)/admin/users/components/user-actions"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { formatDate } from "@/lib/date"
import { type Role } from "@/lib/auth/roles"
import Image from "next/image"

export type UserRow = {
  id: string
  name: string
  username: string
  email: string
  image: string | null
  role: Role
  emailVerified: boolean
  createdAt: Date
}

interface UsersTableProps {
  users: UserRow[]
  currentUserId: string
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  return (
    <div className="rounded-xl border">
      <Table aria-label="Users table">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-10"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt=""
                        aria-hidden="true"
                        width={32}
                        height={32}
                        className="rounded-full size-8 object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <RoleBadge role={user.role} showIcon />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  {user.emailVerified ? (
                    <CheckCircle2Icon
                      className="size-4 text-emerald-500"
                      aria-label="Verified"
                    />
                  ) : (
                    <XCircleIcon
                      className="size-4 text-muted-foreground"
                      aria-label="Not verified"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <UserActions
                    userId={user.id}
                    userName={user.name}
                    currentRole={user.role}
                    isCurrentUser={user.id === currentUserId}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
