import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User } from "@/lib/auth/auth"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { EditableAvatar } from "@/app/(protected)/profile/components/editable-avatar"
import { EditableName } from "@/app/(protected)/profile/components/editable-name"
import { EditableUsername } from "@/app/(protected)/profile/components/editable-username"
import { siteConfig } from "@/config/site"
import { formatDate, formatRelativeTime } from "@/lib/date"
import { InfoRow } from "@/app/(protected)/profile/components/info-row"
import { RoleBadge } from "@/components/role-badge"
import { Role } from "@/lib/auth/roles"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

interface ProfileInformationProps {
  user: User
}

export function ProfileInformation({ user }: ProfileInformationProps) {
  const defaultName = user.name || siteConfig.users.defaultName

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Basic Info" />
      <Card className="max-w-2xl border-muted/60 shadow-xs">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* Left Column: Avatar & Badge */}
            <div className="flex shrink-0 flex-col items-center gap-4 md:self-center">
              <EditableAvatar
                user={user}
                className="size-36 md:size-60 ring-4 ring-foreground/40 rounded-full"
              />
            </div>

            {/* Right Column: Details & Stats */}
            <div className="flex flex-1 flex-col justify-center min-w-0">
              {/* Header Info: Centered on mobile, left-aligned on desktop */}
              <div className="mb-6 flex flex-col items-center md:items-start min-w-0 w-full">
                {user.role && (
                  <RoleBadge
                    role={user.role as Role}
                    showIcon
                    className="mb-2"
                  />
                )}
                <EditableName initialName={defaultName} />
                <EditableUsername initialUsername={user.username ?? ""} />{" "}
                <p className="text-center text-sm text-neutral-400 md:text-left">
                  {user.email}
                </p>
              </div>

              <Separator className="mb-2 opacity-50" />

              {/* Info Stack */}
              <div className="flex flex-row sm:flex-col gap-4">
                <InfoRow
                  icon={CalendarIcon}
                  label="Member since"
                  value={formatDate(user.createdAt)}
                />
                <InfoRow
                  icon={ClockIcon}
                  label="Last updated"
                  value={formatRelativeTime(user.updatedAt)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
