import { StatCard } from "@/app/admin/overview/components/stat-card"
import { UsersIcon, UserPlusIcon, CalendarIcon } from "lucide-react"

interface UserStatsProps {
  total: number
  thisWeek: number
  thisMonth: number
}

export function UserStats({ total, thisWeek, thisMonth }: UserStatsProps) {
  return (
    <>
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
    </>
  )
}
