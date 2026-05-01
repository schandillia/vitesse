import { ShieldUserIcon, UserIcon } from "lucide-react"
import { ROLES, type Role } from "@/lib/auth/roles"
import { StatCard } from "@/app/(protected)/admin/overview/components/stat-card"

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
    <>
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
    </>
  )
}
