import { Badge } from "@/components/ui/badge"
import { ShieldUserIcon, UserIcon } from "lucide-react"
import { ROLES, type Role } from "@/lib/auth/roles"
import { cn } from "@/lib/utils"

const ROLE_STYLES: Record<string, string> = {
  [ROLES.ADMIN]:
    "bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-medium border border-amber-300/50 shadow-xs shadow-amber-500/30 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-400 dark:text-amber-950 dark:border-amber-200/50",
  [ROLES.USER]: "",
}

const ROLE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [ROLES.ADMIN]: ShieldUserIcon,
  [ROLES.USER]: UserIcon,
}

const FALLBACK_ICON = UserIcon
const FALLBACK_STYLE = ""

interface RoleBadgeProps {
  role: Role
  showIcon?: boolean
  className?: string
}

export function RoleBadge({
  role,
  showIcon = false,
  className,
}: RoleBadgeProps) {
  const Icon = ROLE_ICONS[role] ?? FALLBACK_ICON

  return (
    <Badge
      className={cn(
        "capitalize",
        ROLE_STYLES[role] ?? FALLBACK_STYLE,
        className
      )}
    >
      {showIcon && <Icon className="size-3" aria-hidden="true" />}
      {role}
    </Badge>
  )
}
