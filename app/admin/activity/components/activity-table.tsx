import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/date"
import Image from "next/image"

export type ActivityRow = {
  id: string
  event: string
  metadata: Record<string, any> | null
  createdAt: Date
  user: {
    id: string
    name: string
    email: string
    image: string | null
  } | null
}

const EVENT_STYLES: Record<string, string> = {
  login: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  signup: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  role_change: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  user_deleted: "bg-zinc-100 text-zinc-700 hover:bg-zinc-100",
  failed_login_attempt: "bg-red-100 text-red-700 hover:bg-red-100",
}

const EVENT_LABELS: Record<string, string> = {
  login: "Login",
  signup: "Signup",
  role_change: "Role Change",
  user_deleted: "User Deleted",
  failed_login_attempt: "Failed Login",
}

function parseDetails(
  event: string,
  metadata: Record<string, any> | null
): string {
  if (!metadata) return "-"

  switch (event) {
    case "login":
      return metadata.ipAddress
        ? `From ${metadata.ipAddress}`
        : "Session started"
    case "signup":
      return `Joined as ${metadata.email}`
    case "role_change":
      return `Changed ${metadata.previousRole} → ${metadata.newRole} (${metadata.targetUserName}, ${metadata.targetUserEmail})`
    case "user_deleted":
      return `Deleted ${metadata.deletedUserName} (${metadata.deletedUserEmail})`
    case "failed_login_attempt":
      return `Attempted email ${metadata.attemptedEmail} (IP ${metadata.ipAddress || "Unknown"})`
    default:
      return "-"
  }
}

interface ActivityTableProps {
  rows: ActivityRow[]
}

export function ActivityTable({ rows }: ActivityTableProps) {
  return (
    <div className="rounded-xl border">
      <Table aria-label="Activity log">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-10"
              >
                No activity found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.user ? (
                    <div className="flex items-center gap-3">
                      {row.user.image ? (
                        <Image
                          src={row.user.image}
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
                          {row.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {row.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {row.user.email}
                        </span>
                      </div>
                    </div>
                  ) : row.event === "failed_login_attempt" ? (
                    <span className="text-sm text-muted-foreground">
                      Unknown user
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Deleted user
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      EVENT_STYLES[row.event] ?? "bg-zinc-100 text-zinc-700"
                    }
                  >
                    {EVENT_LABELS[row.event] ?? row.event}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {parseDetails(row.event, row.metadata)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <span suppressHydrationWarning>
                    {row.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <br />
                  <span className="text-xs opacity-70" suppressHydrationWarning>
                    {row.createdAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      timeZoneName: "short",
                    })}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
