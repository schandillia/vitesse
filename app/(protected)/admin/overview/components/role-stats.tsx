import { ShieldUserIcon, UserIcon } from "lucide-react"
import { ROLES, type Role } from "@/lib/auth/roles"
import { StatCard } from "@/app/(protected)/admin/overview/components/stat-card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

const ROLE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [ROLES.ADMIN]: ShieldUserIcon,
  [ROLES.USER]: UserIcon,
}

const FALLBACK_ICON = UserIcon

interface RoleStatsProps {
  roleCounts: { role: Role; count: number }[]
}

export function RoleStats({ roleCounts }: RoleStatsProps) {
  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Role Summary" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleCounts.map(({ role, count }) => {
          const Icon = ROLE_ICONS[role] ?? FALLBACK_ICON
          return (
            <StatCard
              key={role}
              title={`${role.charAt(0).toUpperCase() + role.slice(1)}`}
              value={count}
              description={`Users with ${role} role`}
              icon={Icon}
            />
          )
        })}
      </div>
    </div>
  )
}
