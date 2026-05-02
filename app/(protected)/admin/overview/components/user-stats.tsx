import { StatCard } from "@/app/(protected)/admin/overview/components/stat-card"
import { SessionStats } from "@/app/(protected)/admin/overview/components/session-stats"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { UsersIcon, UserPlusIcon, CalendarIcon } from "lucide-react"

interface UserStatsProps {
  total: number
  thisWeek: number
  thisMonth: number
  activeSessions: number
}

export function UserStats({
  total,
  thisWeek,
  thisMonth,
  activeSessions,
}: UserStatsProps) {
  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Users Summary" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={total}
          description="All registered users"
          icon={UsersIcon}
        />
        <StatCard
          title="New This Week"
          value={thisWeek}
          description="Signups in the last 7 days"
          icon={UserPlusIcon}
        />
        <StatCard
          title="New This Month"
          value={thisMonth}
          description="Signups in the last 30 days"
          icon={CalendarIcon}
        />
        <SessionStats activeSessions={activeSessions} />
      </div>
    </div>
  )
}
