import { UserAvatar } from "@/components/auth/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User } from "@/lib/auth/auth"
import { format, formatDistanceToNow } from "date-fns"
import { ShieldIcon, CalendarIcon, ClockIcon } from "lucide-react"
import { EditableName } from "./editable-name"

interface ProfileInformationProps {
  user: User
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/50">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

export function ProfileInformation({ user }: ProfileInformationProps) {
  const defaultName = user.name || user.email.split("@")[0]

  return (
    <div className="space-y-6">
      <Card className="max-w-xl overflow-hidden border-muted/60 shadow-sm">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            {/* Left Column: Avatar & Badge */}
            <div className="flex shrink-0 flex-col items-center gap-4">
              <div className="rounded-full ring-4 ring-foreground/40">
                <UserAvatar user={user} className="size-36 md:size-60" />
              </div>
            </div>

            {/* Right Column: Details & Stats */}
            <div className="flex flex-1 flex-col justify-center">
              {/* Header Info: Centered on mobile, left-aligned on desktop */}
              <div className="mb-6 flex flex-col items-center md:items-start">
                {user.role && (
                  <Badge className="gap-1.5 px-3 py-1 mb-2 capitalize">
                    <ShieldIcon className="size-3" aria-hidden="true" />
                    {user.role}
                  </Badge>
                )}
                <EditableName initialName={defaultName} userId={user.id} />
                <p className="text-center text-base text-muted-foreground md:text-left">
                  {user.email}
                </p>
              </div>

              <Separator className="mb-2 opacity-50" />

              {/* Info Stack */}
              <div className="flex flex-row sm:flex-col gap-4">
                <InfoRow
                  icon={CalendarIcon}
                  label="Member since"
                  value={format(new Date(user.createdAt), "MMMM d, yyyy")}
                />
                <InfoRow
                  icon={ClockIcon}
                  label="Last updated"
                  value={formatDistanceToNow(new Date(user.updatedAt), {
                    addSuffix: true,
                  })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
